const mysql = require('mysql');

const mysqlcredentials = require('./credentials');


const config = {
  host: mysqlcredentials.host,
  user: mysqlcredentials.user,
  password: mysqlcredentials.password,
  database: mysqlcredentials.database,
}


const mysqlConnection = mysql.createConnection(config);

mysqlConnection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("MySQL connected");
  }
});



module.exports = mysqlConnection