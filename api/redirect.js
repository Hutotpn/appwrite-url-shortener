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
      shortCode
    );
    const longURL = result.longURL;

    if (host && host.endsWith("hutotpn.live")) {
      res.setHeader("Content-Type", "text/html");
      return res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Deprecated Domain</title>
            <meta http-equiv="refresh" content="5;url=${longURL}">
            <style>
              body { font-family: sans-serif; padding: 2rem; text-align: center; background: #fffbe6; }
              .box { border: 1px solid #ffe58f; background: #fffbe6; padding: 2rem; border-radius: 8px; display: inline-block; }
              a { color: #fa8c16; text-decoration: underline; }
            </style>
          </head>
          <body>
            <div class="box">
              <h2>⚠️ You're visiting from a deprecated domain</h2>
              <p><strong>example.old</strong> will be shut down on <strong>30 November</strong>.</p>
              <p>Please update your bookmarks to the new domain: <a href="https://example.com">example.com</a></p>
              <p>Redirecting to: <a href="${longURL}">${longURL}</a> in 5 seconds...</p>
            </div>
          </body>
        </html>
      `);
    }

    return res.redirect(302, longURL);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
}
