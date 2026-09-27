const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');
const { runInNewContext } = require('node:vm');
const ts = require('typescript');
const React = require('react');

function loadModule(path, context = {}) {
  const sandbox = { exports: {}, ...context };
  const source = ts.transpileModule(
    readFileSync(join(__dirname, '..', path), 'utf8'),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
      },
    },
  ).outputText;
  runInNewContext(source, sandbox);
  return sandbox.exports;
}

const { crowdfundingCampaign } = loadModule(
  'lib/crowdfunding.ts',
);
const end = Date.parse(crowdfundingCampaign.endsAt);

function hookHarness(initialTime) {
  let now = initialTime;
  let state;
  let effect;
  let nextId = 0;
  const timers = new Map();
  const listeners = new Map();
  const clock = class extends Date {
    static now() {
      return now;
    }
  };
  const campaign = loadModule('lib/crowdfunding.ts', {
    Date: clock,
  });
  const events = (target) => ({
    addEventListener: (event, handler) =>
      listeners.set(`${target}:${event}`, handler),
    removeEventListener: (event) =>
      listeners.delete(`${target}:${event}`),
  });
  const { useCrowdfundingActive } = loadModule(
    'hooks/useCrowdfundingActive.ts',
    {
      Date: clock,
      window: events('window'),
      document: events('document'),
      setTimeout: (callback, delay) => {
        timers.set(++nextId, { callback, delay });
        return nextId;
      },
      clearTimeout: (id) => timers.delete(id),
      require(name) {
        if (name === '@/lib/crowdfunding') return campaign;
        if (name === 'react')
          return {
            useState(initial) {
              if (state === undefined) state = initial;
              return [
                state,
                (value) => {
                  state = value;
                },
              ];
            },
            useEffect(callback) {
              effect = callback;
            },
          };
        throw new Error(`Unexpected import: ${name}`);
      },
    },
  );
  return {
    render: useCrowdfundingActive,
    mount: () => effect(),
    advanceTo: (value) => {
      now = value;
    },
    timers,
    listeners,
  };
}

test('navigation expires at the central deadline without reload and cleans up listeners', () => {
  const hook = hookHarness(end - 1000);
  assert.equal(
    hook.render(),
    false,
    'No build-time campaign link in cached HTML',
  );
  const unmount = hook.mount();
  assert.equal(hook.render(), true);
  const timer = [...hook.timers.values()][0];
  assert.equal(timer.delay, 1000);
  hook.advanceTo(end);
  timer.callback();
  assert.equal(hook.render(), false);
  assert.equal(hook.timers.size, 0);
  unmount();
  assert.equal(hook.listeners.size, 0);
});

test('already expired pages never show Ulule; long waits stay below the timer limit', () => {
  const expired = hookHarness(end);
  expired.render();
  expired.mount();
  assert.equal(expired.render(), false);
  assert.equal(expired.timers.size, 0);
  const active = hookHarness(end - 50 * 86400000);
  active.render();
  const unmount = active.mount();
  assert.equal([...active.timers.values()][0].delay, 60000);
  unmount();
  assert.equal(active.timers.size, 0);
});

for (const event of [
  'window:focus',
  'window:pageshow',
  'document:visibilitychange',
]) {
  test(`returning to a suspended page retires the link on ${event}`, () => {
    const hook = hookHarness(end - 1);
    hook.render();
    const unmount = hook.mount();
    hook.advanceTo(end + 1);
    hook.listeners.get(event)();
    assert.equal(hook.render(), false);
    unmount();
  });
}

function buttons(element) {
  if (!React.isValidElement(element)) return [];
  if (element.type === 'button') return [element];
  return React.Children.toArray(
    element.props.children,
  ).flatMap(buttons);
}

for (const lang of ['fr', 'en', 'de', 'es', 'it', 'lb']) {
  for (const mode of ['desktop', 'mobile']) {
    test(`${lang} ${mode}: native Ulule item, localized route, active state and safe late click`, () => {
      const dictionary = JSON.parse(
        readFileSync(
          join(__dirname, `../locales/${lang}.json`),
          'utf8',
        ),
      );
      assert.equal(
        dictionary.header.MainHeader.Ulule,
        'Ulule',
      );
      let active = true;
      let now = end - 1;
      let closed = 0;
      const pushes = [];
      const campaign = loadModule('lib/crowdfunding.ts', {
        Date: class extends Date {
          static now() {
            return now;
          }
        },
      });
      const { MainHeader } = loadModule(
        'components/MainHeader.tsx',
        {
          require(name) {
            if (name === 'next/navigation')
              return {
                useParams: () => ({ lang }),
                usePathname: () => `/${lang}/crowdfunding`,
                useRouter: () => ({
                  push: (href) => pushes.push(href),
                }),
              };
            if (name === '@/hooks/useDictionary')
              return { useDictionary: () => dictionary };
            if (name === '@/hooks/useCrowdfundingActive')
              return {
                useCrowdfundingActive: () => active,
              };
            if (name === '@/lib/crowdfunding')
              return campaign;
            if (name === './ui/button')
              return { Button: 'button' };
            if (name === './Typography')
              return { Typography: 'span' };
            if (name === 'framer-motion')
              return {
                motion: { div: 'div', span: 'span' },
              };
            return require(name);
          },
        },
      );
      const props = {
        className:
          mode === 'desktop'
            ? 'hidden flex-row gap-4 lg:flex'
            : 'flex flex-col items-start space-y-2',
        closeMenu:
          mode === 'mobile'
            ? () => {
                closed++;
              }
            : undefined,
      };
      let rendered = buttons(MainHeader(props));
      const ulule = rendered.find(
        (button) =>
          button.props.children.props?.children?.[0] ===
          'Ulule',
      );
      assert.ok(ulule);
      assert.equal(
        ulule.props.variant,
        rendered[0].props.variant,
      );
      assert.equal(
        ulule.props.children.props.className,
        rendered[0].props.children.props.className,
      );
      assert.ok(
        ulule.props.children.props.children[1],
        'Active underline on crowdfunding',
      );
      ulule.props.onClick();
      assert.equal(pushes.pop(), `/${lang}/crowdfunding`);
      now = end;
      ulule.props.onClick();
      assert.equal(
        pushes.pop(),
        `/${lang}`,
        'A delayed expiry timer cannot leave a dead destination',
      );
      assert.equal(closed, mode === 'mobile' ? 2 : 0);
      active = false;
      rendered = buttons(MainHeader(props));
      assert.equal(
        rendered.length,
        5,
        'Original four navigation items and social-media button remain',
      );
      rendered[0].props.onClick();
      assert.equal(pushes.pop(), `/${lang}`);
    });
  }
}
