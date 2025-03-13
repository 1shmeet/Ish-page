require("dotenv").config(); // Load environment variables
const express = require("express");
const bodyParser = require("body-parser");
const oracledb = require("oracledb");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'https://singh-1shmeet.web.app',  // Change this to your frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(bodyParser.json());

// Oracle DB Configuration
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECTION_STRING,
};

// API to Check Database Connection
app.get("/db-status", async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    res.status(200).json({ message: "✅ Database Connected Successfully!" });
  } catch (error) {
    console.error("❌ Database Connection Failed:", error);
    res.status(500).json({ message: `❌ Failed to Connect: ${error.message}` });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// API to Insert Contact Message
app.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  let connection;
  try {
    // Get connection to the Oracle DB
    connection = await oracledb.getConnection(dbConfig);

    // Insert the contact message into the database
    const query = `
      INSERT INTO CONTACT_MESSAGES (NAME, EMAIL, SUBJECT, MESSAGE)
      VALUES (:name, :email, :subject, :message)
    `;
    
    await connection.execute(query, { name, email, subject, message }, { autoCommit: true });

    // Respond with success message
    res.status(201).json({ message: "✅ Message Sent Successfully!" });
  } catch (error) {
    console.error("❌ Error Inserting Message:", error);
    res.status(500).json({ error: "❌ Failed to insert message into database." });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
