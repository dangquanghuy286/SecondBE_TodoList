const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema(
  {
    title: String,
    status: String,
    content: String,
    timeStart: Date,
    timeFinish: Date,
    deleted: {
      type: Boolean,
      default: false,
    },
    deleteDate: Date,
  },
  {
    timestamps: true,
  }
);
const taskManager = mongoose.model("taskManager", taskSchema, "task");
module.exports = taskManager;
