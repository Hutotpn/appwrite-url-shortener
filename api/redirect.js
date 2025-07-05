const sdk = require("node-appwrite");

const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT);

const database = new sdk.Databases(client);

export default async function handler(req, res) {
  const { shortCode } = req.query;
  const host = req.headers.host;

  if (!shortCode) {
    return res.status(400).send("shortCode is required");
  }

  try {
    const result = await database.getDocument(
      process.env.URL_DB,
      process.env.URL_COL,
      shortCode,
    );
    const longURL = result.longURL;

    if (host && host.endsWith("hutotpn.live")) {
      res.setHeader("Content-Type", "text/html");
      return res.send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Domain Transition Notice</title>
    <link rel="stylesheet" href="/styles.css" />
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
    <meta
      name="description"
      content="just a small heads-up - Huto URL Shortener"
    />
    <meta property="og:title" content="Domain Transition Notice" />
    <meta
      property="og:description"
      content="just a small heads-up - Huto URL Shortener"
    />
    <meta property="og:image" content="/images/deprecated.png" />
    <meta http-equiv="refresh" content="5; url=${longURL}" />
  </head>
  <body class="font-display h-screen">
    <main
      class="grid min-h-full place-items-center bg-[#ebe9e8] px-6 py-24 sm:py-32 lg:px-8 dark:bg-[#1c1c1e]"
    >
      <div class="text-center">
        <p class="text-base font-semibold text-rose-600 dark:text-rose-300">
          Domain Transition Notice
        </p>
        <h1
          class="font-handwriting mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl dark:text-gray-100"
        >
          hey... just a small heads-up
        </h1>
        <p
          class="font-humanist mt-6 text-lg font-medium text-pretty text-gray-900 sm:text-xl/8 dark:text-gray-100"
        >
          this link is from
          <strong class="text-sky-600 dark:text-sky-300"
            >go.hutotpn.live</strong
          >
          we’re moving to
          <a
            href="https://go.hutotpn.com" + ${req.path}
            class="text-sky-600 underline duration-500 hover:text-violet-500 dark:text-sky-300 dark:hover:text-violet-300"
            >go.hutotpn.com</a
          >
          <br />
          the old one works until
          <strong class="text-rose-600 dark:text-rose-300">nov 30, 2025</strong>
        </p>
        <div class="mt-4 text-2xl">
          <a
            href="https://github.com/Hutotpn/url-shortener/discussions/14"
            class="font-handwriting text-rose-600 underline duration-500 hover:text-sky-600 dark:text-rose-300 dark:hover:text-sky-300"
          >
            more info →
          </a>
        </div>
        <p
          class="font-handwriting mt-4 text-xl text-rose-600 dark:text-rose-300"
        >
          redirecting in 5 seconds…
        </p>
        <p class="font-handwriting mt-4 text-xl text-gray-500">( ´ ▽ \` )</p>
      </div>
    </main>
  </body>
</html>
      `);
    }

    return res.redirect(302, longURL);
  } catch (error) {
    res.setHeader("Content-Type", "text/html");
    return res.status(404).send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>URL Not found</title>
    <link rel="stylesheet" href="/styles.css" />
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
    <meta name="description" content="URL Not found - Huto URL Shortener" />
    <meta property="og:title" content="URL Not found" />
    <meta
      property="og:description"
      content="URL Not found - Huto URL Shortener"
    />
    <meta property="og:image" content="/images/404.png" />
  </head>
  <body class="font-display h-screen">
    <main
      class="grid min-h-full place-items-center bg-[#ebe9e8] px-6 py-24 sm:py-32 lg:px-8 dark:bg-[#1c1c1e]"
    >
      <div class="text-center">
        <p class="text-base font-semibold text-rose-600 dark:text-rose-300">
          404
        </p>
        <h1
          class="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl dark:text-gray-100"
        >
          URL not found
        </h1>
        <p
          class="mt-6 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8"
        >
          Sorry, we couldn’t find the URL you’re looking for.
        </p>
      </div>
    </main>
  </body>
</html>
`);
  }
}
