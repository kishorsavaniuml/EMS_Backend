const Attendance = require("../models/Attendance");
const User = require("../models/User");

exports.markAttendance = async (req, res) => {
  try {
    const userId = req.user._id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingAttendance = await Attendance.findOne({
      userId,
      createdAt: { $gte: today, $lt: tomorrow },
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for today",
      });
    }

    const markedAttendance = await Attendance.create({
      userId,
      status: "present",
    });

    console.log(markedAttendance);

    const presentEmployee = await User.findByIdAndUpdate(
      userId,
      { $push: { attendance: markedAttendance._id } },
      { returnDocument: "after" },
    );

    /*if(!presentEmployee){
        -> delete user marked attendance first by db call
        -> then res.status...*/

    res.status(200).json({
      success: true,
      message: "attendance marked successfully",
      data: markedAttendance,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "error while marking attendnace",
      data: null,
    });
  }
};

/*put above code in deepseek or chatgpt to validate ,
it will explain you about racing conditon between markAttendance and
presentEmployee updation with push attendance because both make async call so possible 
if previous on fail and next one success then attendance updated may be faild or program may get crashed?
it will suggest you about virtual field in schema of user named attendances*/

//you can do it manually like if presenrUser fail then firdt delete marked attendance ane  send response to fail.

exports.getAllAttendances = async (req, res) => {
  try {
    const AllAttendances = await Attendance.find().populate("userId");

    res.status(200).json({
      success: true,
      message: "all attendances successfully",
      data: AllAttendance,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "error while fetching all attendnaces",
    });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const userId = req.user._id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);



    const attendance = await Attendance.findOne({
      userId,
      createdAt: { $gte: today , $lt:tomorrow },
    });

        if (!attendance) {
      return res.status(200).json({
        success: true,
        message: "No attendance found for today",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "attendance found successfully",
      data: attendance,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "error while finding today's attendnace",
    });
  }
};

exports.markCheckOutAttendance = async (req, res) => {
  try {
    const userId = req.user._id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);



    const attendance = await Attendance.findOneAndUpdate({
      userId,
      createdAt: { $gte: today , $lt:tomorrow }
    },{ checkOutTime : new Date()} , {returnDocument : "after"});

        if (!attendance) {
      return res.status(500).json({
        success: false,
        message: "No attendance found for today",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "attendance check out successfully",
      data: attendance,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "error while check out attendnace",
    });
  }
};