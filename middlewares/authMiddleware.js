const jwt = require("jsonwebtoken");
require("dotenv").config();
//const cookieParser = require("cookie-parser"); add only in server.js

exports.isLoggedIn = (req,res,next) =>{
    try{
        let token =
        req.cookies?.token ||
        req.body?.token ||
        req.headers.authorization?.split(" ")[1];



        if(!token){
            return res.status(400).json({
                success : false,
                message:"token missing",
            })
        }

        try{
            const payload = jwt.verify(token,process.env.JWT_SECRET)
            //name decoded is good practice instead of giving name payload

            req.user = payload.user // fetch payload.user(see obj structure through console) from token then create new key named user in curren request and assign this payload object to that key
            

        } catch(err){
            console.error(err.message);
            return res.status(400).json({

                success:false,
                message : "token is invalid , login again"
            })
        }


        next();

    }catch(err){
        console.error(err);
        res.status(500).json({
            success : false,
            message : "error while authentication through token",
            data : null
        })
    }
}

exports.isAdmin = (req,res,next) => {
    try{
        const role = req.user.role;
        if(role!=="admin"){
            return res.status(400).json({
                success:false,
                message:"this is protected routes for admin",
            })
        }else{
                next();
        }

       
    }catch(err){
        console.error(err);
        res.status(500).json({
            success : false,
            message : "server error while cheking role"
        })
    }

   
}

exports.isEmployee = (req,res,next) => {
    try{
        const role = req.user.role;
        if(role!=="employee"){
            return res.status(400).json({
                success:false,
                message:"this is protected routes for employee",
            })
        }else{
                next();
        }

    }catch(err){
        console.error(err);
        res.status(500).json({
            success : false,
            message : " server error while cheking role"
        })
    }

   
}