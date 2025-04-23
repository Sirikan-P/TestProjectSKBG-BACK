//import lib
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

require('dotenv').config()

//import route
const authRoute = require('./routes/auth-route')
const walletRoute = require('./routes/wallet-route')
const exchangeRoute = require('./routes/exchange-route')
const transferRoute = require('./routes/transfer-route')
const withdrawalRoute = require('./routes/withdrawal-route')

//import handle error 
const notFound = require('./middlewares/notFound')
const errorMiddleware = require('./middlewares/errorMiddleware')

//use express object
const app = express()

app.use(morgan('dev')) 
app.use(express.json()) 
app.use(cors()) 


//router
app.use('/auth', authRoute)
app.use('/wallet', walletRoute)
app.use('/exchange',  exchangeRoute )
app.use('/transfer', transferRoute )
app.use('/withdrawals', withdrawalRoute )

//notfound middleware
app.use( notFound )

//error middleware
app.use( errorMiddleware )

//start server
const port = process.env.PORT || 8800
app.listen(port, ()=> console.log('Server on ', port))


