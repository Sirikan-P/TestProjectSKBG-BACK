//import error message
const createError= require("../utils/createError")
const { getExchangeOrderDetail , getUserExchangeOrders ,createExchangeOrder } = require('../services/exchangeService');

exports.showUserExchangeOrders = async (req,res)=>{
    //throw new Error('easy handle error')
try {
    const userId = parseInt(req.params.userId);
  if (isNaN(userId)) {
    return createError(400,'Invalid user ID')    
  }
    const orders = await getUserExchangeOrders(userId);
    res.json(orders);

} catch (error) {
    createError(500,'Server error')
}
}

exports.add = async (req, res) => {
try {
    const { userId, fromCurrency, toCurrency, amountFrom } = req.body;
    const order = await createExchangeOrder({ userId, fromCurrency, toCurrency, amountFrom });
    res.status(201).json(order);
} catch (error) {
    createError(400, error.message )
}
}

exports.showExchangeOrderDetail = async (req,res)=> {
    try {
        const orderId = parseInt(req.params.id);       
        const order = await getExchangeOrderDetail(orderId);
        if (!order) {
          return createError(404,'Order not found');
        }
        res.json(order);
      } catch (err) {
        createError(500,'Server error')
      }
}



