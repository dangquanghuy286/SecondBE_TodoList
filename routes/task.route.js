const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task.controller");
const { requireAuth } = require("../middlewares/auth");

router.use(requireAuth);
router.get("/", taskController.index);
router.get("/detail/:id", taskController.detail);
router.patch("/change-status/:id", taskController.changeStatus);
router.patch("/change-multi", taskController.changeMulti);
router.post("/create", taskController.create);
router.patch("/edit/:id", taskController.edit);
router.patch("/delete/:id", taskController.delete);
router.delete("/delete-permanent/:id", taskController.deletePermanently);
router.patch("/restore/:id", taskController.restore);
module.exports = router;
