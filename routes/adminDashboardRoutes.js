
const express = require("express");
const { isLoggedIn, isAdmin } = require("../middlewares/authMiddleware");
const {getAdminDashboardData} = require("../controllers/adminDashboardController")


const router = express.Router();

router.get("/" , isLoggedIn , isAdmin , getAdminDashboardData);


module.exports = router;