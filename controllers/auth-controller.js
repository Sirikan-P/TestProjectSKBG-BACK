const prisma = require("../models")
const createError = require("../utils/createError")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


//----------------------------------------------------------------------
exports.login = async (req,res,next)=>{
    try {
        //login step --------------------
        // step 1 :: req.body
        // step 2 :: validate email and password
        // step 3 :: generate token
        // step 4 :: response
        //----------------------------------

        // step 1 :: req.body
        const { email, password } = req.body

        // step 2 :: validate email and password
        const profile = await prisma.user.findFirst({
            where: {
                email:email 
            }
        })
        //console.log(profile)
        if(!profile) {
            return createError(400,"email or password is invalid")
        }

        //const isMatch = bcrypt.compareSync( password , profile.password )
        // if(!isMatch){
        //     return createError(400,"email or password is invalid")
        // }

        //test seed not hashed
        if(password !== profile.password){
            return createError(400,"email or password is invalid")
        }
        
        // step 3 :: generate token
        // --create object without password
        const payload = {
            id:profile.id,
            email:profile.email
        }
        // --create token
        const token = jwt.sign(payload,process.env.SECRET, {
            expiresIn: "10d"
        })
        
        const { password : pw  , createdAt , updatedAt , ...userData } = profile
        
        // step 4 :: response to front
        res.json({
            message:"Login success",
            payload:payload,
            token: token ,
            user: userData})
    } catch (err) {
        next(err)
    }
}

//----------------------------------------------------------------------
exports.currentUser = async (req,res,next)=>{
    try {
        const { email } = req.user
        
        const profile = await prisma.user.findFirst({
            where: {email: email 
            },
            select: {
                id: true,
                email: true                        
            }
        })

        res.json({ result:profile})
    } catch (error) {
        next(error)
    }
}