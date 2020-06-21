const express = require('express')
var cors = require('cors')
const app = express()
const port = 3000
const axios = require('axios')
const querystring = require('querystring');
require('dotenv').config()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Started server on port: ${port}`))




const mysqlConnection = require('./mysql')

app.use('/auth', require('./routes/auth/'))
app.use('/vasttrafik', require('./routes/vasttrafik/'))
app.use('/calendar', require('./routes/calendar/'))
app.use('/usersettings', require('./routes/usersettings/'))


