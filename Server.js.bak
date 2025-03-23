const express = require("express");
const crypto = require("crypto");
const app = express();
const PORT = process.env.PORT || 10000;

const VERIFICATION_TOKEN = "7f0a8c12b4f643c9a8c70842e73f7b89"; // your production token
const ENDPOINT = "https://fragrancehook.life/webhook"; // your final domain

app.use(express.json());

// Handle GET challenge
app.get("/webhook", (req, res) => {
  const challenge = req.query.challenge_code;
  if (challenge) {
    console.log("✅ Received GET challenge from eBay:", challenge);
    res.status(200).send(challenge);
  } else {
    console.log("❌ GET request missing challenge");
    res.status(400).send("Missing challenge");
  }
});

// Handle POST challenge for Marketplace Deletion
app.post("/webhook", (req, res) => {
  const challengeCode = req.body.challengeCode;
  const token = req.body.verificationToken;

  if (challengeCode && token === VERIFICATION_TOKEN) {
    const hash = crypto.createHash("sha256");
    hash.update(challengeCode);
    hash.update(token);
    hash.update(ENDPOINT);
    const challengeResponse = hash.digest("hex");

    console.log("✅ Valid POST challenge. Responding with:", challengeResponse);

    res.status(200).json({ challengeResponse });
  } else {
    console.log("❌ Invalid POST body", req.body);
    res.status(400).send("Invalid challenge request");
  }
});

app.get("/", (req, res) => {
  res.send("✅ Webhook server is live!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
