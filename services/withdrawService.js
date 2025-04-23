const prisma = require('../models');
const { sendCrypto } = require('./binanceService');

async function handleWithdraw({ userId, walletId, currencyCode, amount, destination }) {
  const wallet = await prisma.wallet.findUnique({ where: { id: walletId } });

  if (!wallet || wallet.userId !== userId || wallet.currencyCode !== currencyCode) {
    throw new Error('Invalid wallet or currency.');
  }

  if (wallet.balance < amount) {
    throw new Error('Insufficient balance.');
  }

  // Step 1: Deduct balance
  await prisma.wallet.update({
    where: { id: walletId },
    data: { balance: { decrement: amount } },
  });

  // Step 2: Create withdrawal request
  const withdrawal = await prisma.withdrawalRequest.create({
    data: {
      userId,
      walletId,
      currencyCode,
      amount,
      destination,
      status: 'PROCESSING',
    },
  });

  // Step 3: Create transaction history
  await prisma.transactionHistory.create({
    data: {
      userId,
      walletId,
      currency: currencyCode,
      amount,
      type: 'WITHDRAW',
      referenceId: withdrawal.id,
    },
  });

  // Step 4: Send to Binance API
  const txHash = await sendCrypto(currencyCode, amount, destination);

  // Step 5: Update withdrawal record
  await prisma.withdrawalRequest.update({
    where: { id: withdrawal.id },
    data: {
      status: 'COMPLETED',
      txHash,
    },
  });

  return { message: 'Withdraw completed', txHash };
}

module.exports = {
  handleWithdraw,
};
