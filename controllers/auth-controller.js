const prisma = require("../models")
const createError = require("../utils/createError")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.register = async (req,res,next)=>{

    try {

        //register step --------------------
        // step 1 :: req.body
        // step 2 :: validate
        // step 3 :: check already
        // step 4 :: encrypt bcrypt
        // step 5 :: insert to DB
        // step 6 :: response
        //----------------------------------

        // step 1 :: req.body
        const { email , fullName , password , confirmPassword } = req.body

        // step 2 :: validate
        if(password!==confirmPassword){
            return createError(400,"incorrect confirm password")
        }
        if(fullName =='' || email =='') {
            return createError(400,"please add all data")
        }

        // step 3 :: check already exist
        const checkEmail = await prisma.user.findFirst({
            where: {
                email: email,
            }
        })

        if(checkEmail){
            return createError(400,"email is already exist")
        }

        // step 4 :: encrypt bcrypt password
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password,salt)

        // step 5 :: insert to DB
        const profile = await prisma.user.create({
            data:{
                email : email ,
                fullName : fullName,
                password: hashedPassword ,
            }
        })

        // step 6 :: response
        res.json({message:`hello ${ fullName } ... register complete`})
    } catch (err) {
        console.log("stop 2 catch")
        next(err)
    }
}
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

        const isMatch = bcrypt.compareSync( password , profile.password )
        if(!isMatch){
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