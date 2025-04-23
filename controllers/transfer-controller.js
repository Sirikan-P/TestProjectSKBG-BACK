//import error message
const createError= require("../utils/createError")
const { transferBetweenUsers } = require('../services/transferService');


exports.internalTransfer =  async (req, res) => {
try {
    const {
        senderUserId,
        receiverUserId,
        fromWalletId,
        toWalletId,
        currencyCode,
        amount,
      } = req.body;
      const result = await transferBetweenUsers({
        senderUserId,
        receiverUserId,
        fromWalletId,
        toWalletId,
        currencyCode,
        amount: parseFloat(amount),
      });
  
      res.status(201).json(result);
} catch (error) {
    createError(500, error.message )
}
}

exports.show = (req,res)=>{
  //throw new Error('easy handle error')
try {
  res.json({message:"Hello, show list"})
} catch (error) {
  createError(500, error.message )
}
}


