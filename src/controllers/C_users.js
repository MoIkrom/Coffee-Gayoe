// const { response } = require("express");
const usersRepo = require("../repo/R_users");

module.exports = {
  get: async (req, res) => {
    try {
      const response = await usersRepo.getAccount(req.query);
      res.status(201).json({
        result: response.rows,
      });
    } catch (err) {
      res.status(500).json({ msg: "Internal Server Error", error: err.message });
    }
  },
  create: async (req, res) => {
    const { body } = req;
    try {
      const response = await usersRepo.register(req.body);
      res.status(201).json({
        msg: "Register Success",
        data: {
          ...response.rows[0],
          email: body.email,
          name: body.name,
          phone_number: body.phone_number,
          role: body.role,
        },
      });
    } catch (err) {
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
  edit: async (req, res) => {
    try {
      const response = await usersRepo.editAccount(req.body, req.params);
      res.status(200).json({ msg: " Edit data success", result: response });
    } catch (err) {
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
  drop: async (req, res) => {
    try {
      const response = await usersRepo.deleteAccount(req.params);
      res.status(200).json({
        msg: "Delete data success",
        result: response,
      });
    } catch (err) {
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },

  password: async (req, res) => {
    const { body } = req;
    usersRepo
      .editPassword(body)
      .then((response) => {
        res.status(500).json({
          msg: "Password has been changed",
          data: null,
        });
      })
      .catch(() => {
        return res.status(500).json({ msg: "Internal Server Erorr" });
      });
  },
};
