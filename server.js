/****************************************************
 * server.js
 * Supports eBay Webhook Verification:
 * - Platform Notifications: expects ?challenge=
 * - Marketplace Account Deletion: expects ?challenge_code=
 * Also uses process.env.PORT for Render.
 ****************************************************/

const express = require("express");
const crypto = require("crypto");

const app = express();

// Replace these with your real values:
const VERIFICATION_TOKEN = "7f0a8c12b4f643c9a8c70842e73f7b89";
const ENDPOINT_URL = "https://fragrancehook.life/webhook"; // Must match your final domain exactly

// Use the port Render provides
const PORT = process.env.PORT;

// Parse JSON bodies for POST requests if needed
app.use(express.json());

/****************************************************
 * GET /webhook
 * Handles both:
 * 1) Platform Notifications verification (challenge)
 * 2) Marketplace Account Deletion verification (challenge_code)
 ****************************************************/
app.get("/webhook", (req, res) => {
  const challengeCode = req.query.challenge_code;  // for marketplace deletion
  const challenge = req.query.challenge;           // for platform notifications

  // 1) If we got a 'challenge_code', do the Marketplace Deletion approach
  if (challengeCode) {
    console.log("✅ Received GET challenge_code from eBay:", challengeCode);

    // Per eBay docs:  sha256(challengeCode + verificationToken + endpoint)
    const hash = crypto.createHash("sha256");
    hash.update(challengeCode);
    hash.update(VERIFICATION_TOKEN);
    hash.update(ENDPOINT_URL);
    const challengeResponse = hash.digest("hex");

    // Return JSON with challengeResponse
    // eBay expects: {"challengeResponse": "<hashed-string>"}
    res.status(200).json({ challengeResponse });

    return;
  }

  // 2) If we got 'challenge', do the Platform Notifications approach
  if (challenge) {
    console.log("✅ Received GET challenge from eBay (Platform Notifications):", challenge);
    // eBay expects the raw challenge string as plain text
    res.set("Content-Type", "text/plain");
    res.status(200).send(challenge);

    return;
  }

  // If neither param is present, it's an invalid request
  console.log("❌ GET request missing challenge or challenge_code");
  res.status(400).send("Missing challenge parameter");
});

/****************************************************
 * POST /webhook (Optional)
 * If eBay or your app sends POST requests,
 * you can handle them here. Not always required
 * for the initial verification but might be used
 * for notifications.
 ****************************************************/
app.post("/webhook", (req, res) => {
  console.log("🔔 POST /webhook received body:", req.body);
  // Handle incoming notifications or additional verifications
  res.sendStatus(200);
});

/****************************************************
 * Health Check or Root Route
 ****************************************************/
app.get("/", (req, res) => {
  res.send("✅ eBay Webhook is live on Render!");
});

/****************************************************
 * Start the Server
 ****************************************************/
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
