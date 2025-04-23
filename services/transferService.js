const prisma = require('../models');

async function transferBetweenUsers({
  senderUserId,
  receiverUserId,
  fromWalletId,
  toWalletId,
  currencyCode,
  amount,
}) {
  if (senderUserId === receiverUserId) {
    throw new Error("Cannot transfer to yourself");
  }

  return await prisma.$transaction(async (tx) => {
    // ตรวจสอบยอดเงิน
    const fromWallet = await tx.wallet.findUnique({ where: { id: fromWalletId } });

    if (!fromWallet || fromWallet.balance < amount) {
      throw new Error('Insufficient funds');
    }

    // หักยอด
    await tx.wallet.update({
      where: { id: fromWalletId },
      data: {
        balance: { decrement: amount },
      },
    });

    // เพิ่มยอดให้ผู้รับ
    await tx.wallet.update({
      where: { id: toWalletId },
      data: {
        balance: { increment: amount },
      },
    });

    // สร้าง InternalTransfer record
    const transfer = await tx.internalTransfer.create({
      data: {
        senderUserId,
        receiverUserId,
        fromWalletId,
        toWalletId,
        currencyCode,
        amount,
      },
    });

    // TransactionHistory ของผู้ส่ง
    await tx.transactionHistory.create({
      data: {
        userId: senderUserId,
        walletId: fromWalletId,
        currency: currencyCode,
        amount: amount,
        type: 'TRANSFER',
        referenceId: transfer.id,
      },
    });

    // TransactionHistory ของผู้รับ
    await tx.transactionHistory.create({
      data: {
        userId: receiverUserId,
        walletId: toWalletId,
        currency: currencyCode,
        amount: amount,
        type: 'DEPOSIT',
        referenceId: transfer.id,
      },
    });

    return transfer;
  });
}

module.exports = {
  transferBetweenUsers,
};