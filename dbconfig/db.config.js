
const mysql = require('mysql'); // added mySQL into project with (npm install mysql) 

let mysqlConnectionDetails = mysql.createConnection({
  host     : process.env.RDS_HOSTNAME || "awseb-e-3dfy2cmveg-stack-awsebrdsdatabase-ajmunhxpe3du.cn6trlnkww3v.ap-southeast-2.rds.amazonaws.com" ,
  user     : process.env.RDS_USERNAME || 'admin',
  password : process.env.RDS_PASSWORD || '5932259322Abc!',
  port     : process.env.RDS_PORT || 3306 ,
  database: 'leebay'
});

//   multipleStatements: true?? - Do I need this above?

module.exports = {mysqlConnectionDetails}