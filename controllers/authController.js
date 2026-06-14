const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: " please enter email and password both",
        data: null,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "user not registered",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    let token;
    if (isPasswordMatch) {
      user = user.toObject();
      user.password = undefined;

      const payloadForJwtToken = {
        user,
      };
      token = jwt.sign(payloadForJwtToken, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: " wrong password",
      });
    }
    const optionsForCookie = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: false,
      sameSite: "none"
    };
    res.header("Authorization" , `Bearer ${token}`).cookie("token", token, optionsForCookie).status(200).json({
      success: true,
      message: "login successful",
      user,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: " error in login",
      data: null,
    });
  }
};
