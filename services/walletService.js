const prisma = require('../models');

async function getUserWallets(userId) {
  return await prisma.wallet.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

async function createWallet(userId, currencyCode) {

  const existing = await prisma.wallet.findFirst({
    where: { userId, currencyCode },
  });

  if (existing) {
    throw new Error(`Wallet for ${currencyCode} already exists`);
  }

  return await prisma.wallet.create({
    data: {
      userId,
      currencyCode,
      balance: 0,
    },
  });
}


async function getWalletById(walletId) {
  return await prisma.wallet.findUnique({
    where: { id: walletId },
  });
}

module.exports = {
  getUserWallets,
  createWallet,
  getWalletById,
};