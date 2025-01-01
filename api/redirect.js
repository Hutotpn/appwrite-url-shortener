const sdk = require("node-appwrite");

export default async function handler(req, res) {
  const { shortCode } = req.query;

  if (!shortCode) {
    return res.status(400).json({ error: "shortCode is required" });
  }

  // Initialize Appwrite client
  const client = new sdk.Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT);

  const database = new sdk.Databases(client);

  try {
    // Retrieve the document by shortCode
    const result = await database.listDocuments(
      process.env.URL_DB,
      process.env.URL_COL,
      [`shortCode=${shortCode}`]
    );

    if (result.documents.length === 0) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    const longURL = result.documents[0].longURL;

    // Redirect to the original URL
    return res.redirect(301, longURL);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
