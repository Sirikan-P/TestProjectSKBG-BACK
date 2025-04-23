//import error message
const createError= require("../utils/createError")
const withdrawService = require('../services/withdrawService');

exports.add =  async (req, res) => {
try {
    const result = await withdrawService.handleWithdraw(req.body);
    res.status(201).json(result);
} catch (error) {
    createError(500, error.message )
}
}


exports.show = (req,res)=>{
    //throw new Error('easy handle error')
try {
    res.json({message:"Hello,withdrawal show list"})
} catch (error) {
    createError(500, error.message )
}
}


