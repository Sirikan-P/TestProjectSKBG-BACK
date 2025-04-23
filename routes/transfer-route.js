const express = require("express")
const router = express.Router()

//import controller
const controller = require("../controllers/transfer-controller")

//import validator 

//import middleware
const { authorize } = require("../middlewares/authenticate")

//@ENDPOINT http://localhost:8800/transfer/internal
 
router.post('/internal', authorize ,controller.internalTransfer ) 

//export
module.exports = router