const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');
const { runInNewContext } = require('node:vm');
const ts = require('typescript');

// Use the project's existing TypeScript compiler; no additional test dependency.
const compiled = ts.transpileModule(
  readFileSync(
    join(__dirname, '../lib/crowdfunding.ts'),
    'utf8',
  ),
  { compilerOptions: { module: ts.ModuleKind.CommonJS } },
).outputText;
const campaignModule = { exports: {} };
runInNewContext(compiled, campaignModule);
const { crowdfundingCampaign, isCrowdfundingActive } =
  campaignModule.exports;

test('middleware expires all six URLs without rebuilding and preserves attribution', async () => {
  const { NextRequest } = require('next/server');
  let now = Date.parse(crowdfundingCampaign.endsAt) - 1;
  const runtimeCampaign = {
    exports: {},
    Date: class extends Date {
      static now() {
        return now;
      }
    },
  };
  runInNewContext(compiled, runtimeCampaign);
  const middlewareModule = {
    exports: {},
    require(name) {
      if (name === '@/lib/constants')
        return {
          locales: ['en', 'fr', 'de', 'es', 'it', 'lb'],
        };
      if (name === '@/lib/crowdfunding')
        return runtimeCampaign.exports;
      return require(name);
    },
  };
  const middlewareCode = ts.transpileModule(
    readFileSync(
      join(
        __dirname,
        '../middlewares/with-crowdfunding.ts',
      ),
      'utf8',
    ),
    { compilerOptions: { module: ts.ModuleKind.CommonJS } },
  ).outputText;
  runInNewContext(middlewareCode, middlewareModule);
  let continued = 0;
  const middleware =
    middlewareModule.exports.withCrowdfunding(() => {
      continued++;
    });
  for (const lang of ['en', 'fr', 'de', 'es', 'it', 'lb']) {
    const request = new NextRequest(
      `https://bim-dating.com/${lang}/crowdfunding?utm_source=google&gclid=test%2Bclick`,
    );
    now = Date.parse(crowdfundingCampaign.endsAt) - 1;
    assert.equal(await middleware(request, {}), undefined);
    now++;
    const response = await middleware(request, {});
    assert.equal(response.status, 307);
    assert.equal(
      response.headers.get('location'),
      `https://bim-dating.com/${lang}?utm_source=google&gclid=test%2Bclick`,
    );
    assert.match(
      response.headers.get('cache-control'),
      /no-store/,
    );
  }
  assert.equal(continued, 6);
  assert.equal(
    await middleware(
      new NextRequest('https://bim-dating.com/fr/about'),
      {},
    ),
    undefined,
  );
  assert.equal(continued, 7);
});

test('the confirmed Paris closing time is converted to UTC', () => {
  assert.equal(
    crowdfundingCampaign.endsAt,
    '2026-11-16T22:59:00Z',
  );
  assert.equal(
    new Intl.DateTimeFormat('fr-FR', {
      timeZone: 'Europe/Paris',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).format(new Date(crowdfundingCampaign.endsAt)),
    '23:59',
  );
});

test('expiry changes at the exact boundary, including in a long-lived process', () => {
  const end = Date.parse(crowdfundingCampaign.endsAt);
  assert.equal(isCrowdfundingActive(end - 1), true);
  assert.equal(isCrowdfundingActive(end), false);
  assert.equal(isCrowdfundingActive(end + 1), false);
  assert.equal(
    isCrowdfundingActive(end + 50 * 86400000),
    false,
  );
});

test('only the requested Ulule campaign is configured', () => {
  assert.equal(
    crowdfundingCampaign.url,
    'https://fr.ulule.com/dating-app-rencontre-en-video-/',
  );
  assert.equal(
    crowdfundingCampaign.siteUrl,
    'https://bim-dating.com',
  );
});

test('the language switch keeps repeated parameters, encoded attribution and the anchor', () => {
  const React = require('react');
  const navigations = [];
  const ui = new Proxy(
    {},
    {
      get: (_, key) =>
        key === '__esModule' ? false : String(key),
    },
  );
  const context = {
    exports: {},
    window: {
      location: {
        search:
          '?utm_source=google&gclid=a%2Bb&tag=one&tag=two',
        hash: '#bim',
      },
    },
    require(name) {
      if (name === 'react')
        return {
          ...React,
          useState: () => [null, () => {}],
          useEffect: () => {},
        };
      if (name === 'next/navigation')
        return {
          usePathname: () => '/fr/crowdfunding',
          useRouter: () => ({
            push: (url) => navigations.push(url),
          }),
        };
      return ui;
    },
  };
  const source = ts.transpileModule(
    readFileSync(
      join(__dirname, '../components/LanguageSwitcher.tsx'),
      'utf8',
    ),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.React,
      },
    },
  ).outputText;
  runInNewContext(source, context);
  function findChangeHandler(element) {
    if (!element || typeof element !== 'object') return;
    if (element.props?.onValueChange)
      return element.props.onValueChange;
    for (const child of React.Children.toArray(
      element.props?.children,
    )) {
      const handler = findChangeHandler(child);
      if (handler) return handler;
    }
  }
  const changeLanguage = findChangeHandler(
    context.exports.LanguageSwitcher(),
  );
  assert.equal(typeof changeLanguage, 'function');
  for (const lang of ['en', 'fr', 'de', 'es', 'it', 'lb']) {
    changeLanguage(lang);
    assert.equal(
      navigations.at(-1),
      `/${lang}/crowdfunding?utm_source=google&gclid=a%2Bb&tag=one&tag=two#bim`,
    );
  }
});

function stringPaths(value, prefix = '') {
  if (typeof value === 'string') {
    assert.ok(value.trim(), `Empty translation: ${prefix}`);
    return [prefix];
  }
  return Object.entries(value).flatMap(([key, child]) =>
    stringPaths(child, `${prefix}.${key}`),
  );
}

const languages = ['en', 'fr', 'de', 'es', 'it', 'lb'];
const dictionaries = languages.map(
  (lang) =>
    JSON.parse(
      readFileSync(
        join(__dirname, `../locales/${lang}.json`),
        'utf8',
      ),
    ).crowdfunding,
);

for (const [index, lang] of languages.entries()) {
  test(`${lang}: complete translations and full campaign sections`, () => {
    const content = dictionaries[index];
    assert.deepEqual(
      stringPaths(content),
      stringPaths(dictionaries[0]),
    );
    assert.ok(content.hero.cta.includes('BIM Dating'));
    assert.ok(content.hero.cta.includes('Ulule'));
    assert.equal(content.experience.items.length, 3);
    assert.equal(content.funding.items.length, 4);
    assert.ok(content.faq.items.length >= 5);
  });
}
