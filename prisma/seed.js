const prisma = require('../models')
console.log('DB seed...')

async function seedDB() {
 // Create users
 const alice = await prisma.user.create({
  data: {
    email: 'alice@example.com',
    password: 'hashed_password1',
    fullName: 'Alice Wonderland',
  },
});

const bob = await prisma.user.create({
  data: {
    email: 'bob@example.com',
    password: 'hashed_password2',
    fullName: 'Bob Builder',
  },
});

// Create wallets
const aliceWallet = await prisma.wallet.create({
  data: {
    userId: alice.id,
    currencyCode: 'THB',
    balance: 10000,
  },
});

const bobWallet = await prisma.wallet.create({
  data: {
    userId: bob.id,
    currencyCode: 'BTC',
    balance: 0.5,
  },
});

// Create exchange rate
const rate = await prisma.exchangeRate.create({
  data: {
    fromCurrency: 'THB',
    toCurrency: 'BTC',
    rate: 0.0000012,
  },
});

// Create exchange order
const order = await prisma.exchangeOrder.create({
  data: {
    userId: alice.id,
    fromCurrency: 'THB',
    toCurrency: 'BTC',
    amountFrom: 5000,
    amountTo: 0.006,
    currentRate: rate.rate,
    exchangeRateId: rate.id,
    walletId: aliceWallet.id,
    status: 'COMPLETED',
  },
});

// Create internal transfer
await prisma.internalTransfer.create({
  data: {
    senderUserId: alice.id,
    receiverUserId: bob.id,
    fromWalletId: aliceWallet.id,
    toWalletId: bobWallet.id,
    currencyCode: 'THB',
    amount: 1000,
  },
});

// Create withdrawal
await prisma.withdrawalRequest.create({
  data: {
    userId: bob.id,
    walletId: bobWallet.id,
    currencyCode: 'BTC',
    amount: 0.01,
    destination: 'external-wallet-address',
    status: 'PENDING',
  },
});

// Create transaction history
await prisma.transactionHistory.createMany({
  data: [
    {
      userId: alice.id,
      walletId: aliceWallet.id,
      currency: 'THB',
      amount: 5000,
      type: 'EXCHANGE',
    },
    {
      userId: bob.id,
      walletId: bobWallet.id,
      currency: 'BTC',
      amount: 0.01,
      type: 'WITHDRAW',
    },
  ],
});
    

}

seedDB().then(async () => {
  console.log('🌱 Seed complete.');
  await prisma.$disconnect();
})
.catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});