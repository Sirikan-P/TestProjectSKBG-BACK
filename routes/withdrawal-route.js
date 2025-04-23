const express = require("express")
const router = express.Router()

//import controller
const controller = require("../controllers/withdrawal-controller")

//import validator 

//import middleware
const { authorize } = require("../middlewares/authenticate")

//@ENDPOINT http://localhost:8800/withdrawals/add
router.get('/:userId', authorize ,controller.show ) 
router.post('/', authorize ,controller.add ) 


//export
module.exports = router