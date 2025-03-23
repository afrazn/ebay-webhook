const crypto = require("crypto");
const express = require("express");
const app = express();
const PORT = process.env.PORT;

const VERIFICATION_TOKEN = "7f0a8c12b4f643c9a8c70842e73f7b89";
const ENDPOINT_URL = "https://fragrancehook.life/webhook";  // Your full Render domain endpoint

app.use(express.json());

// Marketplace Deletion + Platform Notifications GET handler
app.get("/webhook", (req, res) => {
  const challengeCode = req.query.challenge_code || req.query.challenge;

  if (!challengeCode) {
    console.log("❌ GET request missing challenge");
    return res.status(400).send("Missing challenge");
  }

  console.log("✅ Received GET challenge from eBay:", challengeCode);

  // Create hashed response
  const hash = crypto.createHash("sha256");
  hash.update(challengeCode);
  hash.update(VERIFICATION_TOKEN);
  hash.update(ENDPOINT_URL);
  const responseHash = hash.digest("hex");

  res.status(200).json({ challengeResponse: responseHash });
});
