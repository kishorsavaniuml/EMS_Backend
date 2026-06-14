const express = require("express");
const { createUser, getAllEmployees, updateUser, getSingleUser, deleteEmployee } = require("../controllers/userController");
const { isLoggedIn, isAdmin , isEmployee } = require("../middlewares/authMiddleware");
const router = express.Router();


router.post("/" , isLoggedIn , isAdmin , createUser);
router.get("/" , isLoggedIn , isAdmin , getAllEmployees);
router.put("/:id" , isLoggedIn , isAdmin , updateUser );
router.get("/user" ,isLoggedIn , isEmployee , getSingleUser);
router.get("/:id" ,isLoggedIn,isAdmin ,   getSingleUser);
router.delete("/:id" , isLoggedIn , isAdmin , deleteEmployee);



module.exports = router; 

