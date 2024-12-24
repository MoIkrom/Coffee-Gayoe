const supabase = require("../config/supabase");

module.exports = {
  createTransactions: (data, items) =>
    new Promise((resolve, reject) => {
      // Insert transaksi utama ke tabel transactions
      supabase
        .from("transactions")
        .insert([
          {
            user_id: data.user_id,
            total_belanja: data.total_belanja,
            status: data.status,
          },
        ])
        .select("*")
        .then((result) => {
          if (result.error) {
            return reject(result.error);
          }

          // Ambil ID transaksi yang baru saja dimasukkan
          const transactionId = result.data[0].id;

          // Menyusun data untuk tabel transaction_items berdasarkan items
          const itemsData = items.map((item) => ({
            transaction_id: transactionId,
            product_id: item.product_id,
            quantity: item.quantity,
            price: 1000, // Misalnya harga per item, ganti sesuai dengan kebutuhan
          }));

          // Insert data ke tabel transaction_items
          supabase
            .from("transaction_items")
            .insert(itemsData)
            .select("*")
            .then((itemsResult) => {
              if (itemsResult.error) {
                reject(itemsResult.error);
              } else {
                resolve({
                  transaction: result.data[0],
                  items: itemsResult.data,
                });
              }
            })
            .catch((itemsError) => reject(itemsError));
        })
        .catch((error) => reject(error));
    }),

  getTransactionDetails: (transactionId) =>
    new Promise((resolve, reject) => {
      // Ambil data transaksi beserta itemnya
      supabase
        .from("transactions")
        .select("*, transaction_items(*)")
        .eq("id", transactionId)
        .then((result) => {
          if (result.error) {
            reject(result.error);
          } else {
            resolve(result.data[0]);
          }
        })
        .catch((error) => reject(error));
    }),

  getCountTransactions: () =>
    new Promise((resolve, reject) => {
      supabase
        .from("transactions")
        .select("*", { count: "exact" })
        .then((result) => {
          if (!result.error) {
            resolve(result.count);
          } else {
            reject(result);
          }
        });
    }),
  getAllTransactions: (offset, limit) =>
    new Promise((resolve, reject) => {
      supabase
        .from("transactions")
        .select("*")
        .range(offset, offset + limit - 1)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getCountHistory: () =>
    new Promise((resolve, reject) => {
      supabase
        .from("transactions")
        .select("*", { count: "exact" })
        .then((result) => {
          if (!result.error) {
            resolve(result.count);
          } else {
            reject(result);
          }
        });
    }),
  getHistory: (id, offset, limit) =>
    new Promise((resolve, reject) => {
      supabase
        .from("transactions")
        .select(
          `
          id, 
          total_belanja,
          created_at,
          transaction_items( 
          quantity,
            products(
              product_name,
              price,
              image
                    )
          )
          `
        )
        .eq("user_id", id)
        .order("created_at", { ascending: false })
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getDetailHistory: (id, offset, limit) =>
    new Promise((resolve, reject) => {
      supabase
        .from("transaction_items")
        .select(
          `products(
              product_name,
              price,
              image
                   )
          `
        )
        .eq("user_id", id)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
};
