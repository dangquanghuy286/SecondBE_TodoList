const express = require("express");
require("dotenv").config();
const database = require("./config/database");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT;
database.connect();
const routeApiV1 = require("./routes/index.route");

// parser
app.use(bodyParser.json());
// Routes Version 1
routeApiV1(app);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
