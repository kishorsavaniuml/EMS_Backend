const mongoose = require("mongoose");
const { Schema } = mongoose;

const attendanceSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    checkInTime: {
      type: Date,
      required:true,
      default : Date.now,
    },
    checkOutTime: {
      type: Date,
      default : null
    },
    status: {
      type: String,
      enum: ["present" ,"absent"],
      default:"absent"
    },
  },
  {
    timestamps: true,
  },
);


const Attendance = mongoose.model("Attendance" , attendanceSchema);
module.exports = Attendance;