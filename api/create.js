const sdk = require("node-appwrite");

// Initialize Appwrite client
const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT);

const database = new sdk.Databases(client);

export default async function handler(req, res) {
  const { shortCode, longURL } = req.query;

  console.log("Create URL: ", shortCode, "\n", "Long URL: ", longURL);

  if (!shortCode && !longURL) {
    return res
      .status(400)
      .json({ error: "shortCode and longURL are required" });
  }

  try {
    // Retrieve the document by shortCode
    const result = await database.createDocument(
      process.env.URL_DB,
      process.env.URL_COL,
      shortCode,
      {
        longURL: longURL,
      }
    );

    // Redirect to the original URL
    return res.status(201).json({
      message: "URL created successfully",
      data: result,
      url: "https://go.hutotpn.live/" + shortCode,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
