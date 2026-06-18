const express = require("express");
const app = express();
require("dotenv").config();
const SERVER_PORT = process.env.PORT || process.env.SERVER_PORT || 4000;
const dbConnect = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const leaveRoutes = require("./routes/leaveRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");

app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? [
          "https://ems-frontend-g3qvquaq0-kishorsavaniuml-6951s-projects.vercel.app",
        ]
      : [
          "http://localhost:5173",
          "http://localhost:3000",
          "http://localhost:5174",
        ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/attendances", attendanceRoutes);
app.use("/api/admin-dashboard", adminDashboardRoutes);

dbConnect();

app.get("/", (req, res) => {
  res.send("<h1>this is home page routes fro server.js</h1>");
});
app.listen(SERVER_PORT, () => {
  console.log("server is runnig on port " + SERVER_PORT);
});
