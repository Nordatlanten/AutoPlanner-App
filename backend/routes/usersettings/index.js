const express = require('express')
const router = express.Router()
const uuid = require('uuid')

const mysqlConnection = require('./../../mysql')

router.post('/addLocation', (req, res) => {

  mysqlConnection.query(
    `INSERT INTO locations (id, userId, altLocationName, locationName, longitude, latitude) 
        VALUES (${mysqlConnection.escape(uuid.v4())}, ${mysqlConnection.escape(req.body.userId)}, ${mysqlConnection.escape(req.body.altLocationName)}, ${mysqlConnection.escape(req.body.locationName)}, 
        ${mysqlConnection.escape(req.body.longitude)}, ${mysqlConnection.escape(req.body.latitude)}) `, (error, result) => {
    if (error) {
      console.log(req.body)
      console.log(error);
      return res.status(500).send();
    }
    return res.status(200).send()
  });

})


router.post('/getLocationList', (req, res) => {

  mysqlConnection.query(
    `SELECT * FROM locations WHERE userId = ${mysqlConnection.escape(req.body.userId)}`, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send();
      }
      res.status(200).send(result)
    });

})

router.post('/deleteLocation', (req, res) => {

  mysqlConnection.query(
    `DELETE FROM locations WHERE userId = ${mysqlConnection.escape(req.body.userId)} AND locationName = ${mysqlConnection.escape(req.body.locationName)}`, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send();
      }
      res.status(200).send(result)
    });

})

router.post('/setTimeMargin', (req, res) => {

  mysqlConnection.query(
    `UPDATE users SET timeMargin = ${mysqlConnection.escape(req.body.timeMargin)} WHERE id = ${mysqlConnection.escape(req.body.userId)}`, (err, result) => {
      if (err) {
        console.log(err)
        return res.status(500).send()
      }
      res.status(200).send(result)
    }
  )
})

router.post('/getTimeMargin', (req, res) => {
  mysqlConnection.query(
    `SELECT timeMargin FROM users WHERE id = ${mysqlConnection.escape(req.body.userId)}`, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send();
      }
      res.status(200).send(result)
    });
})


module.exports = router;