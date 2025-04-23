//import error message
const createError= require("../utils/createError")
const {getUserWallets,createWallet,getWalletById,} = require('../services/walletService');

exports.showWallets = async (req,res)=>{    
try {
    const userId = parseInt(req.params.userId);
    const wallets = await getUserWallets(userId);
    res.json(wallets);
} catch (error) {
    createError(500, error.message )
}
}

exports.add =  async (req, res) => {
try {
    const { userId, currencyCode } = req.body;
    const wallet = await createWallet(userId, currencyCode);
    res.status(201).json(wallet);

} catch (error) {
    createError(500, error.message )
}
}

exports.walletDetail = async (req,res)=>{    
try {
    const walletId = parseInt(req.params.id);
    const wallet = await getWalletById(walletId);
    if (!wallet) {
        return createError(404, 'Wallet not found' )
      }
      res.json(wallet);
    res.json({message:"Hello,wallet details"})
} catch (error) {
    next(error)
}
}


