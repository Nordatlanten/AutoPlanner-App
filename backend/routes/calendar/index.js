const express = require('express')
const router = express.Router()
const uuid = require('uuid')

const mysqlConnection = require('./../../mysql')



router.post('/addEvent', (req, res) => {
  console.log(req.body);


  if (new Date(req.body.start) > new Date(req.body.end)) {
    res.status(406).send({ msg: "Felaktiga datum" })
  }


  mysqlConnection.query(
    `INSERT INTO events (id, userId, title, start, end, allDay) 
    VALUES (${mysqlConnection.escape(uuid.v4())}, ${mysqlConnection.escape(req.body.userId)}, ${mysqlConnection.escape(req.body.title)}, 
    ${mysqlConnection.escape(req.body.start)}, ${mysqlConnection.escape(req.body.end)}, ${mysqlConnection.escape(req.body.allDay)}) `, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    return res.status(200).send()
  });

})



router.post('/getEvents', (req, res) => {
  console.log(req.body);

  mysqlConnection.query(
    `SELECT * FROM events WHERE userId = ${mysqlConnection.escape(req.body.userId)}`, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send();
      }
      res.status(200).send(result)
    });

})

router.post('/getEvent', (req, res) => {
  console.log(req.body.id);

  mysqlConnection.query(
    `SELECT * FROM events WHERE id = ${mysqlConnection.escape(req.body.id)}`, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send();
      }
      res.status(200).send(result)
    });

});


module.exports = router;