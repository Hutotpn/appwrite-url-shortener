const sdk = require("node-appwrite");

// Initialize Appwrite client
const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT);

const database = new sdk.Databases(client);

export default async function handler(req, res) {
  const { shortCode } = req.query;

  console.log("shortCode", shortCode);

  if (!shortCode) {
    return res.status(400).json({ error: "shortCode is required" });
  }

  try {
    // Retrieve the document by shortCode
    const result = await database.getDocument(
      process.env.URL_DB,
      process.env.URL_COL,
      shortCode
    );

    const longURL = result.longURL;

    // Redirect to the original URL
    return res.redirect(302, longURL);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
}
