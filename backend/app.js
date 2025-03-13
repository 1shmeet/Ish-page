require("dotenv").config(); // Ensure you're loading the .env file
const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

// MongoDB URI from the environment variable
const uri = process.env.MONGO_URI;

let db;

// Connect to MongoDB
const connectToDb = async () => {
  try {
    const client = await MongoClient.connect(uri); // Removed deprecated options
    db = client.db("your_database_name"); // Specify your DB name
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
};

// Make sure MongoDB is connected before handling requests
connectToDb();

// Route to handle contact form submissions
app.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Insert the contact message into the MongoDB collection
    const collection = db.collection("contact_messages"); // Specify the collection name
    await collection.insertOne({ name, email, subject, message });

    res.status(201).json({ message: "✅ Message Sent Successfully!" });
  } catch (error) {
    console.error("Error inserting message:", error);
    res.status(500).json({ error: "Failed to insert message into database." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
