const mongoose = require("mongoose");
const { Schema } = mongoose;

const leaveSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestDate: {
      type: Date,
      default: Date.now,
    },
    leaveStartDate: {
      type: Date,
      required: true,
    },
    leaveEndDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status:{
      type:String,
      enum:["pending" , "approved" , "rejected"],
      default:"pending"
    }
    ,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },

    toObject: {
      virtuals: true,
    },
  },
);

leaveSchema.virtual("totalLeaveDays").get(function () {
  const start = new Date(this.leaveStartDate);
  const end = new Date(this.leaveEndDate);

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  return Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
});

const Leave = mongoose.model("Leave", leaveSchema);

module.exports = Leave;
