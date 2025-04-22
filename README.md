===
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
โอนออกนอกระบบ เชื่อมต่อ Binance API สำหรับถอนเหรียญ
คำขอถอนเงิน (Withdrawal Request)

===
## Installation :


### Clone Project
```bash
git clone https://github.com/your-username/crypto-exchange.git
```
### Setup :
npm init 
npm install express cors nodemon morgan dotenv bcryptjs jsonwebtoken zod
npx prisma init
npx prisma db push 
npx prisma db seed
npm run dev


### env guide :
PORT =8800 
DATABASE_URL= ***  
JWT_SECRET= ***  

===
### service :
|endpoint |method |authen |params |query |body |
|:--- |:--- |:--- |:--- |:--- |:--- |
|/auth/register | post|-|-|-| { username, fullName ,password , confirmPassword} |
|/auth/login | post |-|-|-| {username, password}
|/auth/me |get|y|-|-|-|  {userId}
|/wallet|get|y|-|-|-|  {userId}
|/wallet|post|y|-|-|  
|/wallet|patch|y|:id|-|
|/exchange|post|y|-|-|{userId,fromCurrency,toCurrency, amount} 
|/transfer/internal|post|y|-|-|{fromWalletId , toWalletId,amount}
|/transfer/external|post|y|-|-|{walletId , currencyCode ,amount , destinationAddress}
|/withdrawals|get|y|:id|-|-
|/withdrawals|post|y|-|-|{}
|/withdrawals|patch|y|:id|-|-

===
### Note :
