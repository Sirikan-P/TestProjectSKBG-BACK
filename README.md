
## Crypto Exchange System
ระบบแลกเปลี่ยนเงิน fiat <-> crypto และการโอนเหรียญภายใน/ภายนอกระบบ  

### Tech Stack : 
BACKEND : Node.js, Express, Prisma , MySQL
API Provider: Binance API

### features : 
ระบบจัดการผู้ใช้  
ระบบกระเป๋าเงินผู้ใช้  
แลกเปลี่ยนระหว่างเงิน fiat กับ crypto  
โอนเหรียญภายในระบบ ระหว่างผู้ใช้  
คำขอถอนเงิน (Withdrawal Request) เพื่อ โอนออกนอกระบบ เชื่อมต่อ Binance API สำหรับถอนเหรียญ  


## Installation :


### Clone Project
```bash
git clone https://github.com/your-username/crypto-exchange.git
```
### Setup :
```bash
npm init 
npm install express cors nodemon morgan dotenv bcryptjs jsonwebtoken axios
npx prisma init
npx prisma db push 
npm start
```
### script guide : 
```bash
"scripts": {
  "start": "nodemon server.js",
  "seed": "node prisma/seed.js"
}

npm run seed
```

### env guide :
```bash
PORT =8800 
DATABASE_URL= ***  
JWT_SECRET= ABC  
```

### api :
|endpoint |method |authen |params |query |body |
|:--- |:--- |:--- |:--- |:--- |:--- |
|/auth/login | post |-|-|-| {username, password}
|/auth/me |get|y|-|-|-| 
|/wallet/user|get|y|:userId|-|-| 
|/wallet|post|y|-|-| {userId,currencyCode} 
|/wallet|get|y|:id|-|-|
|/exchange/user|get|y|:userId|-|-|
|/exchange|post|y|-|-|{userId,fromCurrency,toCurrency, amount} 
|/exchange/order|get|y|:id|-|-|
|/transfer/internal|post|y|-|-|{senderUserId,receiverUserId,fromWalletId , toWalletId,currencyCode,amount}
|/withdrawals|get|y|:userId|-|-|
|/withdrawals|post|y|-|-|{userId,walletId,currencyCode,amount,destination}


### Note :
Maintained by Sirikan P.