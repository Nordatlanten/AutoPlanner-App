const nodemailer = require('nodemailer');

const credentials = require('./credentials');


const transporter = nodemailer.createTransport({
  host: "send.one.com",
  port: 465,
  secure: true,
  auth: {
    user: credentials.user,
    pass: credentials.password
  }
});



module.exports = transporter