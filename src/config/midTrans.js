const midTransClient = require("midtrans-client");

const isProduction = false;
const serverKey = process.env.SERVER_KEY_MIDTRANS;
const clientKey = process.env.CLIENT_KEY_MIDTRANS;

const snap = new midTransClient.Snap({ isProduction, serverKey, clientKey });

module.exports = snap;
