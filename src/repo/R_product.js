const supabase = require("../config/supabase");
const { create } = require("../controllers/C_product");

module.exports = {
  getAllProduct: (offset, limit, sortField, sortOrder, searchQuery, category) =>
    new Promise((resolve, reject) => {
      let query = supabase
        .from("products")
        .select("*")
        .range(offset, offset + limit - 1);

      // Tambahkan fitur search jika ada searchQuery
      if (searchQuery) {
        query = query.ilike("product_name", `%${searchQuery}%`); // Ganti "product_name" dengan kolom yang ingin dicari
      }
      // Tambahkan fitur sort jika ada sortField dan sortOrder
      if (sortField && sortOrder) {
        query = query.order(sortField, { ascending: sortOrder === "asc" });
      }

      // Tambahkan fitur sort jika ada sortField dan sortOrder
      if (category) {
        query = query.ilike("category", `%${category}%`);
      }

      query.then((result) => {
        if (!result.error) {
          resolve(result);
        } else {
          reject(result);
        }
      });
    }),
  newProduct: (data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("products")
        .insert([data])
        .select("*")
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getCountProduct: (search, category) =>
    new Promise((resolve, reject) => {
      let query = supabase.from("products").select("*", { count: "exact" });

      // Terapkan filter pencarian jika ada
      if (search) {
        query = query.ilike("product_name", `%${search}%`);
      }
      // Terapkan filter pencarian jika ada
      if (category) {
        query = query.ilike("category", `%${category}%`);
      }

      query
        .then((result) => {
          if (!result.error) {
            resolve(result.count);
          } else {
            reject(result);
          }
        })
        .catch((err) => reject(err));
    }),
  editProduct: (id, data) =>
    new Promise((resolve, reject) => {
      supabase
        .from("products")
        .update(data)
        .select("*")
        .eq("id", id)
        .then((result) => {
          if (!result.error) {
            resolve(result);
          } else {
            reject(result);
          }
        });
    }),
  getProductbyId: (id) =>
    new Promise((resolve, reject) => {
      supabase
        .from("products")
        .select("*")
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
};
