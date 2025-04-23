const express = require("express")
const router = express.Router()

//import controller
const authController = require("../controllers/auth-controller")

//import middleware
const { authorize } = require("../middlewares/authenticate")

//@ENDPOINT http://localhost:8800/auth/login
router.post('/login', authController.login)
router.get('/me' ,authorize,authController.currentUser) 

//export
module.exports = router