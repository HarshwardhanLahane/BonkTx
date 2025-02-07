const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require('cors');
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");

dotenv.config(); // Load environment variables from .env file
connectDB();  // This handles the MongoDB connection
const app = express();
app.use(cors());

app.use(express.json()); // Enable JSON parsing for incoming requests

// Simple route to test the server
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Routes
app.use("/api/users", userRoutes);  // All routes prefixed with /api/users

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));