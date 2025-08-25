const express = require("express");
require("dotenv").config();
const database = require("./config/database");
const Task = require("./models/task.model");
database.connect();
const app = express();
const port = process.env.PORT;

app.get("/tasks", async (req, res) => {
  const tasks = await Task.find({
    deleted: false,
  });
  console.log(tasks);
  res.json(tasks);

  res.render("Danh sách công việc");
});
app.listen(port, () => {
  console.log(`App listen on port ${port}`);
});
