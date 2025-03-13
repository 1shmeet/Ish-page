require("dotenv").config(); // Load environment variables
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection String from .env
const dbURI = process.env.MONGODB_URI;

// MongoDB Connection
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

// Define Contact Schema and Model
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
});

const ContactMessage = mongoose.model("ContactMessage", contactSchema);

// API to Check Database Connection
app.get("/db-status", (req, res) => {
  mongoose.connection.readyState === 1
    ? res.status(200).json({ message: "✅ Database Connected Successfully!" })
    : res.status(500).json({ message: "❌ Database Connection Failed!" });
});

// API to Insert Contact Message
app.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Create a new ContactMessage instance
    const newMessage = new ContactMessage({ name, email, subject, message });

    // Save to the database
    await newMessage.save();

    // Respond with success message
    res.status(201).json({ message: "✅ Message Sent Successfully!" });
  } catch (error) {
    console.error("❌ Error Inserting Message:", error);
    res.status(500).json({ error: "❌ Failed to insert message into database." });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
