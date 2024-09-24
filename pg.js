const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Client } = require("pg");

// PostgreSQL Client Setup
const client = new Client({
  user: "postgres",          // Your PostgreSQL username
  host: process.env.DBIP,     // Your PostgreSQL host
  database: "userdata",      // Your PostgreSQL database name
  password: process.env.DBPASSWORD,   // Your PostgreSQL password
  port: 5432,                // PostgreSQL default port
});

client.connect(function (err) {
  if (err) throw err;
  console.log("Connected to PostgreSQL!");
});

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Allow cross-origin requests

// POST route to store user data
app.post("/store-user", (req, res) => {
  const { name, email } = req.body;

  // First, check if the user already exists
  const checkQuery = {
    text: "SELECT * FROM users WHERE email = $1",
    values: [email],
  };

  client.query(checkQuery)
    .then((result) => {
      if (result.rows.length > 0) {
        // User already exists, return a response indicating so
        console.log("User already exists:", result.rows[0]);
        res.status(200).send("User already exists, no data added.");
      } else {
        // User does not exist, proceed to insert
        const insertQuery = {
          text: "INSERT INTO users(name, email) VALUES($1, $2) RETURNING *",
          values: [name, email],
        };

        client.query(insertQuery)
          .then((insertResult) => {
            console.log("Data inserted:", insertResult.rows[0]);
            res.status(200).send("User data saved successfully");
          })
          .catch((e) => {
            console.error("Error saving data", e.stack);
            res.status(500).send("Error saving user data");
          });
      }
    })
    .catch((err) => {
      console.error("Error checking for existing user", err.stack);
      res.status(500).send("Error checking user existence");
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
