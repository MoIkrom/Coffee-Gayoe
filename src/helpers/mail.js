const nodemailer = require("nodemailer");
const gmail = require("../config/gmail");
const fs = require("fs");
const path = require("path");
const mustache = require("mustache");

module.exports = {
  sendMail: (data) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "mikram216@gmail.com",
        clientId: gmail.clientId,
        clientSecret: gmail.clientsecret,
        refreshToken: gmail.refreshToken,
        accessToken: gmail.accessToken,
      },
    });

    const filetemplate = fs.readFileSync(path.resolve(`src/template/email/${data.template}`), "utf-8");

    const mailOptions = {
      from: `"Coffee Gayoe" <noreply.mail>`,
      to: data.to,
      subject: data.subject,
      html: mustache.render(filetemplate, { ...data }),
    };
    transporter.sendMail(mailOptions, (err, res) => {
      if (err) return console.log(err);
    });
  },
};
