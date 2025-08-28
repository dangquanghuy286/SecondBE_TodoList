const { verifyToken } = require("../helpers/jwt");
const Account = require("../models/user.model");

const requireAuth = async (req, res, next) => {
  try {
    // Lấy token từ header Authorization hoặc cookie
    let token = req.headers.authorization;

    if (token && token.startsWith("Bearer ")) {
      token = token.slice(7);
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        code: 401,
        message: "Vui lòng đăng nhập để truy cập",
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        code: 401,
        message: "Token không hợp lệ",
      });
    }

    // Kiểm tra user còn tồn tại
    const user = await Account.findById(decoded.id).select("-password");
    if (!user || user.deleted || user.status !== "active") {
      return res.status(401).json({
        code: 401,
        message: "Tài khoản không tồn tại hoặc đã bị khóa",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      code: 401,
      message: "Xác thực không thành công",
    });
  }
};

// Middleware kiểm tra role (optional)
const requireRole = (roles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        code: 401,
        message: "Vui lòng đăng nhập",
      });
    }

    if (!roles.includes(req.user.roleId)) {
      return res.status(403).json({
        code: 403,
        message: "Bạn không có quyền truy cập",
      });
    }

    next();
  };
};

module.exports = {
  requireAuth,
  requireRole,
};
