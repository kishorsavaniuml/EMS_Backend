const express = require("express");
const { isLoggedIn, isEmployee, isAdmin } = require("../middlewares/authMiddleware");
const { markAttendance, getAllAttendances ,getAttendance ,markCheckOutAttendance} = require("../controllers/attendanceController");
const router = express.Router();


router.post("/" ,isLoggedIn,isEmployee, markAttendance);
router.get("/" , isLoggedIn ,isAdmin, getAllAttendances);
router.get("/" , isLoggedIn ,isAdmin, getAllAttendances);
router.get("/todayIn" ,isLoggedIn,isEmployee, getAttendance);
router.put("/todayOut" ,isLoggedIn,isEmployee, markCheckOutAttendance);



module.exports = router;
