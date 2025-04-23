const express = require("express")
const router = express.Router()

//import controller
const controller = require("../controllers/wallet-controller")

//import validator 

//import middleware
const { authorize } = require("../middlewares/authenticate")

//@ENDPOINT http://localhost:8800/wallet/user/1
router.get('/user/:userId', authorize ,controller.showWallets ) 
router.post('/add', authorize ,controller.add ) 
router.get('/:id', authorize ,controller.walletDetail ) 

//export
module.exports = router