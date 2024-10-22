const express = require("express");
const app = express();
//db.js
const db = require("./db");

// Use CORS to handle cross-origin requests
const cors = require("cors");
app.use(cors());

require("dotenv").config();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Routes
const apiRoutes = require("./routes/apiRoutes");
app.use("/api", apiRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server Runing... http://localhost:3000/");
});
