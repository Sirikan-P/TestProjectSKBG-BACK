const prisma = require('../models');

async function getExchangeOrderDetail(orderId) {
  return await prisma.exchangeOrder.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      Wallet: true,
      exchangeRate: true,
    },
  });
}

async function getUserExchangeOrders(userId) {
  return await prisma.exchangeOrder.findMany({
    where: { userId },
    include: {
      exchangeRate: true,
      Wallet: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

//---------------------------------------------------------------------------
async function createExchangeOrder({ userId, fromCurrency, toCurrency, amountFrom }) {
  // ตรวจสอบ wallet ต้นทาง
  const fromWallet = await prisma.wallet.findFirst({
    where: { userId, currencyCode: fromCurrency }
  });
  if (!fromWallet || fromWallet.balance < amountFrom) {
    throw new Error('Insufficient balance or wallet not found');
  }

  // ตรวจสอบ wallet ปลายทาง
  let toWallet = await prisma.wallet.findFirst({
    where: { userId, currencyCode: toCurrency }
  });
  if (!toWallet) {
    toWallet = await prisma.wallet.create({
      data: { userId, currencyCode: toCurrency, balance: 0 }
    });
  }

  // หา exchange rate ล่าสุด
  const rate = await prisma.exchangeRate.findFirst({
    where: {
      fromCurrency,
      toCurrency
    },
    orderBy: { timestamp: 'desc' }
  });

  if (!rate) {
    throw new Error('Exchange rate not found');
  }

  const amountTo = rate.rate * amountFrom;

  // ใช้ transaction
  const result = await prisma.$transaction(async (tx) => {
    // หักเงินจาก wallet ต้นทาง
    await tx.wallet.update({
      where: { id: fromWallet.id },
      data: { balance: { decrement: amountFrom } }
    });

    // เพิ่มเงินไปยัง wallet ปลายทาง
    await tx.wallet.update({
      where: { id: toWallet.id },
      data: { balance: { increment: amountTo } }
    });

    // สร้าง ExchangeOrder
    const exchangeOrder = await tx.exchangeOrder.create({
      data: {
        userId,
        fromCurrency,
        toCurrency,
        amountFrom,
        amountTo,
        currentRate: rate.rate,
        exchangeRateId: rate.id,
        walletId: fromWallet.id, // อ้างถึง wallet ต้นทาง
        status: 'COMPLETED'
      }
    });

    // สร้าง TransactionHistory 2 รายการ
    await tx.transactionHistory.createMany({
      data: [
        {
          userId,
          walletId: fromWallet.id,
          currency: fromCurrency,
          amount: -amountFrom,
          type: 'EXCHANGE',
          referenceId: exchangeOrder.id
        },
        {
          userId,
          walletId: toWallet.id,
          currency: toCurrency,
          amount: amountTo,
          type: 'EXCHANGE',
          referenceId: exchangeOrder.id
        }
      ]
    });

    return exchangeOrder;
  });

  return result;
}
//---------------------------------------------------------------------------

module.exports = {
  getExchangeOrderDetail,
  getUserExchangeOrders,
  createExchangeOrder,
};