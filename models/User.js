const mongoose = require("mongoose");
const { Schema } = mongoose;
const Leave = require("./Leave");
const Attendance = require("./Attendance");

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim:true
    },
    lastname: {
      type: String,
      required: true,
      trim:true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase:true,
    },
    password: {
      type: String,
      required: true,
      minlength : 5
    },
    role: {
      type: String,
      enum: ["admin", "employee"],
      required: true,
      default : "employee"
    },
    image: {
      type: String,
      default: function () {
        const fname = this.firstname || "";
        const lname = this.lastname || "";

        return `https://ui-avatars.com/api/?name=${fname}+${lname}&background=random&rounded=true`;
      },
    },
    quatedLeaves : {
      type:Number,
      default :12
    },
    leave: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Leave",
      },
    ],
    attendance: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attendance",
    },]
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);
module.exports = User;
