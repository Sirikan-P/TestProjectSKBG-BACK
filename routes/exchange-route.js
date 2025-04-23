const express = require("express")
const router = express.Router()

//import controller
const controller = require("../controllers/exchange-controller")

//import validator 

//import middleware
const { authorize } = require("../middlewares/authenticate")

//@ENDPOINT http://localhost:8800/exchange/user/1
router.get('/user/:userId', authorize ,controller.showUserExchangeOrders ) 
router.post('/add', authorize ,controller.add ) 
router.get('/order/:id', authorize ,controller.showExchangeOrderDetail ) 
 


//export
module.exports = router