const express = require("express");
const router = express.Router();


const { deleteLeave, getAllLeaves, newLeaveRequest, getMyLeaves, approveLeave } = require("../controllers/leaveController")

const { isLoggedIn, isAdmin , isEmployee } = require("../middlewares/authMiddleware");



router.post("/" , isLoggedIn ,isEmployee, newLeaveRequest);
router.get("/" , isLoggedIn ,isAdmin,getAllLeaves);
router.delete("/:id" ,isLoggedIn, isEmployee,deleteLeave);
router.get("/my-leaves" ,isLoggedIn, isEmployee, getMyLeaves);
router.put("/:id" ,isLoggedIn, isAdmin, approveLeave);

module.exports = router;
