const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      role,
      leave,
      attendance,
      image,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "user already exist",
      });
    }

    let hashedPassword;

    hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role,
      leave,
      attendance,
      image,
    });
    await user.save();

    user.password = undefined;
    res.status(201).json({
      success: true,
      message: role + " created successfully",
      data: user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "error in creating user",
      data: null,
    });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const page = req.query.page;
    const limit = 5;
    const allEmployees = await User.find({ role: "employee" })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-password")
      .populate("leave")
      .populate("attendance");


    const totalPages = allEmployees.length / limit;
    res.status(200).json({
      success: true,
      message: "successfully get all employees details",
      data: allEmployees,
      totalPages: Math.ceil(totalPages),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error while fetching employees",
      data: null,
    });
  }
};
exports.getSingleUser = async (req, res) => {
  try {
    if (req.params.id) {
      userId = req.params.id;
    } else {
      userId = req.user._id;
    }
    // const { id } = req.params;
    // const { id : userId } = req.params;
    const user = await User.findById(userId)
      .select("-password")
      .populate("leave")
      .populate("attendance");
    if (user) {
      res.status(200).json({
        success: true,
        message: "successfully get user details",
        data: user,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "user not found",
        data: null,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "error in getting employee",
      data: null,
    });
  }
};
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, email } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { firstname, lastname, email },
      { returnDocument: "after" },
    )
      .select("-password")
      .populate("leave")
      .populate("attendance");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: " user not found",
        data: null,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "user updated successfully",
        data: user,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "error in updating user",
      data: null,
    });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteEmployee = await User.findByIdAndDelete(id);
    if (!deleteEmployee) {
      return res.status(404).json({
        success: false,
        message: " employee not found",
        data: null,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "employee deleted successfully",
        data: deleteEmployee,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "error in deleting employee",
      data: null,
    });
  }
};
