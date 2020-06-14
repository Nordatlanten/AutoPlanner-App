const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express')
const uuid = require('uuid')
const router = express.Router()

const mysqlConnection = require('../../mysql')
const transporter = require('../../mailer')

router.post('/checkIfValidSession', (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(
      token,
      '2EA067686AB9E32ECA9424DBB1A597DEGJKNRJGK3GO58CECAAE4539E09074BF3A8526A92BF1'
    );
    res.status(200).send(decoded)
  } catch (err) {
    return res.status(401).send({
      msg: 'Your session is not valid!'
    });
  }
})


router.post('/login', (req, res, next) => {
  mysqlConnection.query(`SELECT * FROM users WHERE email = ${mysqlConnection.escape(req.body.email)};`, (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).send();
    }

    if (!result.length) {
      return res.status(401).send({
        msg: 'Felaktigt användarnamn eller lösenord'
      });
    }

    if (result[0].confirmed === 0) {
      return res.status(401).send({
        msg: 'Please confirm your email address first!'
      });
    }
    bcrypt.compare(req.body.password, result[0]['passwordHash'], (bErr, bResult) => {
      if (bErr) {
        console.log(bErr);
        return res.status(401).send({
          msg: 'Felaktigt användarnamn eller lösenord'
        });
      }
      if (bResult) {
        const token = jwt.sign({
          email: result[0].email,
          userId: result[0].id
        },
          '2EA067686AB9E32ECA9424DBB1A597DEGJKNRJGK3GO58CECAAE4539E09074BF3A8526A92BF1', {
          expiresIn: '7d'
        }
        );
        console.log("Logged in: " + result[0].email);
        delete result[0].passwordHash
        return res.status(200).send({
          token,
          user: result[0]
        });
      }
      return res.status(401).send({
        msg: 'Felaktigt användarnamn eller lösenord'
      });
    }
    );
  }
  );
});


router.post('/register', (req, res, next) => {
  mysqlConnection.query(`SELECT * FROM users WHERE LOWER(email) = LOWER(${mysqlConnection.escape(req.body.email)});`, (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).send();
    }

    if (result.length) {
      return res.status(409).send({
        msg: 'Det finns redan ett konto med denna e-post!'
      });
    }

    if (!validateEmail(req.body.email)) {
      return res.status(400).send({
        msg: 'Ange en giltig e-postadress'
      });
    }
    if (!req.body.password || req.body.password.length < 7) {
      return res.status(400).send({
        msg: 'Ange ett lösenord med minst 6 tecken'
      });
    }

    if (!req.body.repeatPassword || req.body.password != req.body.repeatPassword) {
      return res.status(400).send({
        msg: 'Lösenorden matchar inte'
      });
    }

    const confirmToken = uuid.v4()

    bcrypt.hash(req.body.password, 10, (err, hash) => {
      mysqlConnection.query(`INSERT INTO users (id, email, passwordHash, confirmToken) 
      VALUES (${mysqlConnection.escape(uuid.v4())}, ${mysqlConnection.escape(req.body.email)}, ${mysqlConnection.escape(hash)}, ${mysqlConnection.escape(confirmToken)})`,
        (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).send();
          }


          var mailOptions = {
            from: 'AutoPlanner <AutoPlanner@aviliax.com>',
            to: req.body.email,
            subject: 'Bekräfta din e-post',
            html: `<a href="${process.env.HOST}/auth/confirm/${confirmToken}">Bekräfta e-post</a>`
          }

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

          return res.status(201).send({
            msg: 'Registrering lyckades! Kolla din e-post för ett bekräftelsemail'
          });
        });

    });
  }
  );
});


function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

router.post('/confirm', (req, res, next) => {
  mysqlConnection.query(
    `SELECT confirmed FROM users WHERE confirmToken = ${mysqlConnection.escape(req.body.token)};`,
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send();
      }

      if (!result.length) {
        return res.status(401).send({
          msg: "Felaktig nyckel"
        });
      }

      if (result[0].confirmed == 1) {
        return res.status(409).send({
          msg: "E-post redan bekräftad"
        });
      }

      mysqlConnection.query(
        `UPDATE users SET confirmed = 1 WHERE confirmToken = ${mysqlConnection.escape(req.body.token)}`, (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).send();
          }
        });

      return res.status(200).send({
        msg: 'E-post bekräftad!',
      });


    });
});


router.post('/forgot', (req, res, next) => {


  if (!req.body.changingPass) {
    const token = uuid.v4();

    mysqlConnection.query(`SELECT * FROM users WHERE email = ${mysqlConnection.escape(req.body.email)};`, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send();
        }

        if (!result.length) {
          return res.status(200).send({
            msg: "Vänligen kolla din e-post"
          });
        }

        mysqlConnection.query(
          `UPDATE users SET resetToken = '${token}' WHERE email = ${mysqlConnection.escape(req.body.email)}`
        );


        var mailOptions = {
          from: 'AutoPlanner <AutoPlanner@aviliax.com>',
          to: req.body.email,
          subject: 'Glömt lösenord',
          html: `<a href="${process.env.HOST}/auth/forgot/${token}">Skapa nytt lösenord</a>`
        }

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Forgot email sent: ' + info.response);
          }
        });

        return res.status(200).send({
          msg: 'Vänligen kolla din e-post',
        });
      }
    );

  } else {

    bcrypt.hash(req.body.newPass, 10, (err, hash) => {
      if (err) {
        console.log(err);
        return res.status(500).send();
      }

      mysqlConnection.query(
        `SELECT resetToken FROM users WHERE resetToken = ${mysqlConnection.escape(req.body.token)}`, (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).send();
          }

          if (!result.length > 0) {
            return res.status(409).send({
              msg: 'Lösenord redan uppdaterat',
            });
          }

          if (!req.body.repeatPass || req.body.newPass != req.body.repeatPass) {
            return res.status(400).send({
              msg: 'Lösenorden matchar inte'
            });
          }

          mysqlConnection.query(
            `UPDATE users SET passwordHash = ${mysqlConnection.escape(hash)}, resetToken = '', confirmed = 1 WHERE resetToken = ${mysqlConnection.escape(req.body.token)}`, (err, result) => {
              if (err) {
                console.log(err);
                return res.status(500).send();
              }

              return res.status(200).send({
                msg: 'Lösenord ändrat!',
              });
            });
        });
    });
  }
});



module.exports = router;