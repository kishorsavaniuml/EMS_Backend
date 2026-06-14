const User = require("../models/User");
const Leave = require("../models/Leave");

exports.getAdminDashboardData = async (
  req,
  res
) => {
  try {

    const [
      totalEmployees,
      totalLeaves,
      pendingLeaves,
      approvedLeaves,
      rejectedLeaves,
      recentLeaves,
      
    ] = await Promise.all([
      User.countDocuments({
        role: "employee",
      }),

      Leave.countDocuments(),

      Leave.countDocuments({
        status: "pending",
      }),

      Leave.countDocuments({
        status: "approved",
      }),

      Leave.countDocuments({
        status: "rejected",
      }),

      Leave.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .populate("userId"),


    ]);

    return res.status(200).json({
      success: true,

      data: {
        totalEmployees,
        totalLeaves,
        pendingLeaves,
        approvedLeaves,
        rejectedLeaves,
        recentLeaves,

      },
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message:
        "Error fetching dashboard data",
    });
  }
};