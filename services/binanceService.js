const axios = require('axios');

async function sendCrypto(currency, amount, toAddress) {
  // Mock call to Binance API (in real-world, authenticate with API key/secret)
  console.log(`Sending ${amount} ${currency} to ${toAddress}...`);

  // Simulate success response
  return 'mock-tx-hash-123456';
}

module.exports = { sendCrypto };