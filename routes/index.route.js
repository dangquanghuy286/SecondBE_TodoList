const taskRoutes = require("./task.route");
const authRoutes = require("./auth.route");
module.exports = (app) => {
  const version = "/api/v1";
  app.use(version + "/tasks", taskRoutes);
  app.use(version + "/auth", authRoutes);
};
