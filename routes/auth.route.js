const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controller");
const { requireAuth } = require("../middlewares/auth");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/logout", controller.logout);
router.get("/profile", requireAuth, controller.profile);
router.post("/password/forgotPassword", requireAuth, controller.forgotPassword);
router.post("/password/otp", requireAuth, controller.checkOTP);
router.post("/password/resetPassword", requireAuth, controller.resetPassword);

module.exports = router;
