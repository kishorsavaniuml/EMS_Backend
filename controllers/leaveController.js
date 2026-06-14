const Leave = require("../models/Leave");
const User = require("../models/User");

exports.newLeaveRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { leaveStartDate, leaveEndDate, reason } = req.body;
    if (leaveStartDate > leaveEndDate) {
      return res.status(500).json({
        success: false,
        message: " Leave end date must not be less than leave start date",
      });
    }

    const createdLeave = await Leave.create({
      userId,
      leaveStartDate,
      leaveEndDate,
      reason,
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { leave: createdLeave._id } },
      { returnDocument: "after" },
    );
    // if(!updatedUser){return.....};
    //read comment in attendance controller

    res.status(200).json({
      success: true,
      message: "leave applied successfully",
      data: createdLeave,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "error while apply leaves",
    });
  }
};

exports.getAllLeaves = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const allLeaves = await Leave.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(10)
      .populate("userId");
    const totalLeaves = await Leave.countDocuments();

    res.status(200).json({
      success: true,
      message: "get all leaves succesfully",
      data: allLeaves,
      totalPages: Math.ceil(totalLeaves / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      success: false,
      message: "error while fetching all leaves",
    });
  }
};

exports.approveLeave = async (req, res) => {
  const status = req.body.status;
  const leave = await Leave.findById(req.params.id);

  if (!leave) {
    return res.status(404).json({
      success: false,
      message: "Leave not found",
    });
  }

  if (leave.status !== "pending") {
    return res.status(400).json({
      success: false,
      message: "Only pending leaves can be approved",
    });
  }

  leave.status = status;

  await leave.save();

  res.status(200).json({
    success: true,
    message: "Leave approved successfully",
  });
};
exports.deleteLeave = async (req, res) => {
  try {
    const leaveId = req.params.id;

    const deletedLeave = await Leave.findByIdAndDelete(
      leaveId,

      { returnDocument: "after" },
    );
    if (!deletedLeave) {
      res.status(401).json({
        success: false,
        message: "leave not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "leave deleted successfully",
      data: deletedLeave,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      success: false,
      message: "error while deleting leave",
    });
  }
};

exports.getMyLeaves = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = Number(req.query.page) || 1;
    const limit = 10;

    const leaves = await Leave.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalLeaves = await Leave.countDocuments({ userId });

    return res.status(200).json({
      success: true,
      data: leaves,
      totalPages: Math.ceil(totalLeaves / limit),
      currentPage: page,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching leaves",
    });
  }
};
