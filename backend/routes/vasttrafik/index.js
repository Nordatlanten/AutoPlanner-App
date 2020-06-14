const express = require('express')
const router = express.Router()
const axios = require('axios')
const querystring = require('querystring');

const mysqlConnection = require('./../../mysql')

let accessToken = null

router.post('/getToken', async function (req, res) {
  const token = await getAccessToken()
  res.send(token)
})

async function getAccessToken() {

  let isValid = await checkAccessToken(accessToken)

  if (!isValid) {
    await axios.post('https://api.vasttrafik.se/token',
      querystring.stringify({
        grant_type: 'client_credentials',
      }), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic U3ZFYm80S0pReEZ0dUpMUEExN3JLSllocFJnYTpwRWRmTTNkSWhHblNqa2NQb3JDZE1JVTdOVmdh"
      }
    })
      .then(response => {
        accessToken = response.data.access_token
      })
      .catch(err => {
        console.log(err);

      });
  }

  return accessToken
}

async function checkAccessToken(accessToken) {

  return await axios
    .get(
      "https://api.vasttrafik.se/bin/rest.exe/v2/location.name?input=torslanda&format=json",
      {
        headers: {
          "Authorization": "Bearer " + accessToken
        }
      }
    )
    .then(response => true)
    .catch(err => {
      console.log("False");
    });

 
}




router.post('/getNearbyStops', async function (req, res) {
  const token = await getAccessToken()

  const stops = await axios
    .get(
      `https://api.vasttrafik.se/bin/rest.exe/v2/location.nearbystops?originCoordLat=${req.body.lat}&originCoordLong=${req.body.lng}&maxNo=30&maxDist=10000&format=json`,
      {
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    )
    .then(response => response.data.LocationList.StopLocation)
    .catch(err => {
      console.log(err);
    });

  let populatedStops = stops.map((stop, i) => {
    if (stop.track == undefined) {
      return stop
    }
  });

  var filtered = populatedStops.filter(function (el) {
    return el != null;
  });

  res.send(filtered)


})

router.post('/getDepartures', async function (req, res) {
  const token = await getAccessToken()


  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + '%2F' + mm + '%2F' + dd;
  return await axios
    .get(
      `https://api.vasttrafik.se/bin/rest.exe/v2/departureBoard?id=${req.body.id}&date=${today}&time=13%3A00&format=json`,
      {
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    )
    .then(response => {
      res.send(response.data.DepartureBoard.Departure)
    })
    .catch(err => {
      console.log(err);
    });
});



function calcCrow(lat1, lon1, lat2, lon2) {
  var R = 6371; // km
  var dLat = toRad(lat2 - lat1);
  var dLon = toRad(lon2 - lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;

  return d*1000

}

function toRad(Value) 
{
    return Value * Math.PI / 180;
}

module.exports = router;