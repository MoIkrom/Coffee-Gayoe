const snapMidTrans = require("../config/midTrans");

module.exports = {
  payment: (data) =>
    new Promise((resolve, reject) => {
      let parameter = {
        transaction_details: {
          order_id: data.transactionId,
          gross_amount: data.totalPayment,
        },
        credit_card: {
          secure: true,
        },
      };
      snapMidTrans
        .createTransaction(parameter)
        .then((transaction) => {
          resolve(transaction.redirect_url);
        })
        .catch((error) => {
          reject(error);
        });
    }),

  notifikasi: (data) => {
    return new Promise((resolve, reject) => {
      snapMidTrans.transaction
        .notification(data)
        .then((statusResponse) => {
          resolve(statusResponse);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
