const { generateRandomNumber } = require("../helpers/generateNumber");
const { generateToken } = require("../helpers/jwt");
const { sendMail } = require("../helpers/sendMail");
const ForgotPassword = require("../models/forgotPassword.model");
const Account = require("../models/user.model");

// [POST] /auth/register
module.exports.register = async (req, res) => {
  try {
    const { fullName, userName, email, password, phone } = req.body;

    // Kiểm tra email đã tồn tại
    const existingUser = await Account.findOne({
      $or: [{ email }, { userName }],
      deleted: false,
    });

    if (existingUser) {
      return res.status(400).json({
        code: 400,
        message: "Email hoặc username đã tồn tại",
      });
    }

    // Tạo user mới
    const newUser = new Account({
      fullName,
      userName,
      email,
      password,
      phone,
      roleId: "user",
    });

    await newUser.save();

    // Tạo JWT token
    const token = generateToken({
      id: newUser._id,
      email: newUser.email,
    });

    // Set cookie
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({
      code: 201,
      message: "Đăng ký thành công",
      token,
      // user: {
      //   id: newUser._id,
      //   fullName: newUser.fullName,
      //   email: newUser.email,
      // },
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// [POST] /auth/login
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user
    const user = await Account.findOne({
      email,
      deleted: false,
      status: "active",
    });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        code: 401,
        message: "Email hoặc mật khẩu không đúng",
      });
    }

    // Tạo JWT token
    const token = generateToken({
      id: user._id,
      email: user.email,
    });

    // Set cookie
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.json({
      code: 200,
      message: "Đăng nhập thành công",
      token,
      // user: {
      //   id: user._id,
      //   fullName: user.fullName,
      //   email: user.email,
      //   roleId: user.roleId,
      // },
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// [POST] /auth/logout
module.exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({
    code: 200,
    message: "Đăng xuất thành công",
  });
};

// [GET] /auth/profile
module.exports.profile = (req, res) => {
  res.json({
    code: 200,
    user: req.user,
  });
};
//[POST]/auth/password/forgotPassword
module.exports.forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await Account.findOne({
      email: email,
      deleted: false,
    });

    if (!user) {
      res.json({
        code: 400,
        message: "Email không tồn tại !",
      });
      return;
    }

    const otp = generateRandomNumber(8);
    const timeExpire = 5;
    const objForgot = {
      email: email,
      otp: otp,
      expireAt: new Date(Date.now() + timeExpire * 60 * 1000),
    };
    const forgotPassword = new ForgotPassword(objForgot);
    await forgotPassword.save();
    // Gửi OTP qua email
    // Nếu email tồn tại, gửi email reset mật khẩu
    const subject = "Reset Password";
    const html = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2 style="color: #007BFF;">Xác thực OTP</h2>
    <p>Xin chào,</p>
    <p>OTP của bạn là: <strong style="font-size: 1.5em;">${objForgot.otp}</strong></p>
    <p>Mã này sẽ hết hạn sau <strong>${timeExpire} phút</strong>. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
    <br/>
    <p>Trân trọng,</p>
    <p><em>Đội ngũ hỗ trợ</em></p>
  </div>
`;
    await sendMail(email, subject, html);
    res.json({
      code: 200,
      message: "Vui lòng kiểm tra Email để lấy OTP",
    });
  } catch (error) {
    console.error(error);
    res.json({ code: 500, message: "Lỗi hệ thống" });
  }
};
//[POST]/auth/password/otp
module.exports.checkOTP = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;
  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });
  if (!result) {
    res.json({
      code: 400,
      message: "OTP không hợp lệ !",
    });
    return;
  }
  const user = await Account.findOne({
    email: email,
  });

  const token = user.token;
  res.cookie("token", token);
  res.json({
    code: 200,
    message: "Xác thực thành công !",
    token: token,
  });
};
