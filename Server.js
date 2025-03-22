const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const VERIFICATION_TOKEN = "your-verification-token-here"; // use the working one

app.use(express.json());

app.post("/webhook", (req, res) => {
  const challenge = req.body.challenge;
  const token = req.body.verificationToken;

  if (challenge && token === VERIFICATION_TOKEN) {
    console.log("✅ Verified challenge request from eBay");
    res.status(200).send({ challenge });
  } else {
    console.log("❌ Invalid verification request");
    res.status(400).send("Invalid verification");
  }
});

app.get("/", (req, res) => {
  res.send("🛠️ eBay Webhook Listener is live!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
