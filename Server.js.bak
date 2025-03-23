const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const VERIFICATION_TOKEN = "7f0a8c12b4f643c9a8c70842e73f7b89"; // your working token

app.use(express.json());

// Handle GET requests for webhook verification
app.get("/webhook", (req, res) => {
  // eBay might send the challenge as either "challenge" or "challenge_code"
  const challenge = req.query.challenge || req.query.challenge_code;
  
  if (challenge) {
    console.log("✅ Received GET challenge from eBay:", challenge);
    // Explicitly set content type to text/plain
    res.set("Content-Type", "text/plain");
    // Return the raw challenge string
    res.status(200).send(challenge);
  } else {
    console.log("❌ GET request missing challenge");
    res.status(400).send("Missing challenge");
  }
});

// Handle POST requests for webhook verification or actual events
app.post("/webhook", (req, res) => {
  const { challenge, verificationToken: token } = req.body;
  
  if (challenge && token === VERIFICATION_TOKEN) {
    console.log("✅ Verified POST challenge request from eBay:", challenge);
    res.status(200).json({ challenge });
  } else {
    console.log("❌ Invalid POST verification request");
    res.status(400).send("Invalid verification");
  }
});

// Health check route
app.get("/", (req, res) => {
  res.send("🛠️ eBay Webhook Listener is live!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
