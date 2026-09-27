// Run after `npm run build`. Starts the actual production server, not next dev.
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const { readFileSync } = require('node:fs');
const { createServer } = require('node:net');
const { join } = require('node:path');
const { before, after, test } = require('node:test');
const {
  setTimeout: delay,
} = require('node:timers/promises');
const { runInNewContext } = require('node:vm');
const ts = require('typescript');

const root = join(__dirname, '..');
const languages = ['fr', 'en', 'de', 'es', 'it', 'lb'];
const readJson = (path) =>
  JSON.parse(readFileSync(join(root, path), 'utf8'));
const campaignModule = { exports: {} };
runInNewContext(
  ts.transpileModule(
    readFileSync(join(root, 'lib/crowdfunding.ts'), 'utf8'),
    {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    },
  ).outputText,
  campaignModule,
);
const { crowdfundingCampaign, isCrowdfundingActive } =
  campaignModule.exports;

let server;
let origin;
let serverOutput = '';

before(async () => {
  // A missing build must fail, rather than silently testing the development server.
  readFileSync(join(root, '.next/BUILD_ID'), 'utf8');
  const socket = createServer();
  socket.listen(0, '127.0.0.1');
  await once(socket, 'listening');
  const port = socket.address().port;
  await new Promise((resolve) => socket.close(resolve));
  origin = `http://127.0.0.1:${port}`;
  server = spawn(
    process.execPath,
    [
      require.resolve('next/dist/bin/next'),
      'start',
      '--hostname',
      '127.0.0.1',
      '--port',
      String(port),
    ],
    {
      cwd: root,
      windowsHide: true,
      env: {
        ...process.env,
        NODE_ENV: 'production',
        NEXT_TELEMETRY_DISABLED: '1',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
  server.stdout.on('data', (data) => {
    serverOutput += data;
  });
  server.stderr.on('data', (data) => {
    serverOutput += data;
  });
  let startError;
  server.on('error', (error) => {
    startError = error;
  });
  for (let attempt = 0; attempt < 100; attempt++) {
    if (startError) throw startError;
    if (server.exitCode !== null)
      throw new Error(serverOutput);
    try {
      const response = await fetch(
        `${origin}/favicon.png`,
        { signal: AbortSignal.timeout(1000) },
      );
      await response.arrayBuffer();
      if (response.ok) return;
    } catch {}
    await delay(100);
  }
  throw new Error(
    `Production server did not become ready: ${serverOutput}`,
  );
});

after(async () => {
  if (
    server &&
    server.exitCode === null &&
    server.signalCode === null
  ) {
    const exited = once(server, 'exit');
    server.kill();
    await exited;
  }
});

function escapeHtml(text) {
  return text.replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
      })[character],
  );
}

test('production manifest resolves crowdfunding before the generic PDF segment', () => {
  const paths = readJson(
    '.next/server/app-paths-manifest.json',
  );
  assert.ok(paths['/[lang]/crowdfunding/page']);
  const { dynamicRoutes } = readJson(
    '.next/routes-manifest.json',
  );
  for (const lang of languages) {
    const route = dynamicRoutes.find(({ regex }) =>
      new RegExp(regex).test(`/${lang}/crowdfunding`),
    );
    assert.equal(route?.page, '/[lang]/crowdfunding');
  }
});

for (const lang of languages) {
  const dictionary = readJson(`locales/${lang}.json`);

  test(`/${lang}/crowdfunding serves the landing page, never a PDF or middleware rewrite`, async () => {
    const response = await fetch(
      `${origin}/${lang}/crowdfunding?utm_source=google&gclid=test%2Bclick`,
      { redirect: 'manual' },
    );
    assert.equal(
      response.headers.get('x-middleware-rewrite'),
      null,
    );
    assert.match(
      response.headers.get('cache-control'),
      /no-store/,
    );
    if (!isCrowdfundingActive()) {
      assert.equal(response.status, 307);
      assert.equal(
        response.headers.get('location'),
        `${origin}/${lang}?utm_source=google&gclid=test%2Bclick`,
      );
      return;
    }
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('location'), null);
    const html = await response.text();
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.ok(
      html.includes(
        escapeHtml(dictionary.crowdfunding.hero.title),
      ),
    );
    assert.ok(
      html.includes(
        `<title>${escapeHtml(dictionary.crowdfunding.seo.title)}</title>`,
      ),
    );
    assert.equal(
      html.split(`href="${crowdfundingCampaign.url}"`)
        .length - 1,
      3,
    );
    assert.ok(
      html.includes(
        `href="https://bim-dating.com/${lang}/crowdfunding"`,
      ),
    );
    assert.ok(
      !html.includes('/pdf/general_terms_english.pdf'),
    );
    assert.ok(!html.includes('react-pdf__Document'));
  });

  test(`/${lang}: all five supported PDF documents retain their localized file`, async () => {
    assert.equal(Object.keys(dictionary.files).length, 5);
    for (const [slug, file] of Object.entries(
      dictionary.files,
    )) {
      const response = await fetch(
        `${origin}/${lang}/${slug}`,
        { redirect: 'manual' },
      );
      assert.equal(response.status, 200, `${lang}/${slug}`);
      // The server component passes only the validated file to the client viewer.
      const html = await response.text();
      assert.ok(
        html.includes(file),
        `Missing localized PDF: ${file}`,
      );
      const pdf = await fetch(`${origin}/${lang}${file}`);
      assert.equal(pdf.status, 200, file);
      const bytes = Buffer.from(await pdf.arrayBuffer());
      assert.equal(
        bytes.subarray(0, 5).toString(),
        '%PDF-',
        file,
      );
    }
  });

  test(`/${lang}: unknown PDF slugs return HTTP 404 without the default CGU`, async () => {
    for (const slug of [
      'not-a-real-pdf',
      'crowdfunding-typo',
      'toString',
      '__proto__',
    ]) {
      const response = await fetch(
        `${origin}/${lang}/${slug}`,
        { redirect: 'manual' },
      );
      assert.equal(response.status, 404, `${lang}/${slug}`);
      const html = await response.text();
      assert.ok(
        !html.includes('/pdf/general_terms_english.pdf'),
      );
      assert.ok(!html.includes('react-pdf__Document'));
    }
  });
}
