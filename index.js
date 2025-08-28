const express = require("express");
require("dotenv").config();
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT;

database.connect();

// Middleware
app.use(cookieParser()); // Phân tích cookie
app.use(cors()); // Xử lý CORS
app.use(express.json()); // Phân tích body JSON

// Routes Version 1
const routeApiV1 = require("./routes/index.route");
routeApiV1(app);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
