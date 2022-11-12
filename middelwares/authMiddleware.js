const createHttpError = require("http-errors")
const { CustomError } = require("../helper/error")
const jwt = require("jsonwebtoken")

const verifyUser = async(req,res,next) =>{
    console.log("inside")
    try{    
        if(req.cookies.user){
            const result =await jwt.verify(req.cookies.user.userToken,"secretValue")
            if(result){next()}
        }
        else{
            throw new CustomError(401,"user is not authorized",{redirect:"/user/login"})
        }
}
catch(err){
    console.log(err)
    res.redirect("/user/login")
}
}

module.exports = {verifyUser}