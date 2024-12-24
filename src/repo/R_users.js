const supabase = require("../config/supabase");

module.exports = {
  getAllUser: (offset, limit) =>
    new Promise((resolve, reject) => {
      supabase
        .from("users")
        .select("id, email, username, created_at")
        .range(offset, offset + limit - 1)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  Register: (data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("users")
        .insert([data])
        .select("id, email, username, role")
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  RegisterProfile: (data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("profile")
        .insert([data])
        .select("user_id, firstname, lastname, address")
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),

  EditUser: (id, data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("users")
        .update(data)
        .select("id, email, username, role, created_at")
        .eq("id", id)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),

  deleteUser: (id) =>
    new Promise((resolve, reject) => {
      supabase
        .from("users")
        .delete()
        .select()
        .eq("id", id)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),

  getUsersById: (id) =>
    new Promise((resolve, reject) => {
      supabase
        .from("users")
        .select("id, username, email")
        .eq("id", id)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),

  getUserByEmail: (email) => {
    return new Promise((resolve, reject) => {
      supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    });
  },
  getProfile: (id) =>
    new Promise((resolve, reject) => {
      supabase
        .from("users")
        .select(
          `id,
         username,
         email,
         profile (
           firstname,
           lastname,
           image, 
           address,
           phone_number
         )`
        )
        .eq("id", id)
        .then((result) => {
          if (!result.error) {
            resolve(result.data); // Mengambil data hasil query
          } else {
            reject(result.error); // Menangani error jika ada
          }
        });
    }),

  getCountUser: () =>
    new Promise((resolve, reject) => {
      supabase
        .from("users")
        .select("*", { count: "exact" })
        .then((result) => {
          if (!result.error) {
            resolve(result.count);
          } else {
            reject(result);
          }
        });
    }),
};
