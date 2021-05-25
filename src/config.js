const MYSQL = require("mysql");

const DBCONNECTION = MYSQL.createConnection({
	host: `localhost`,
	user: `root`,
	password: `root`,
	database: `express_users`,
});

DBCONNECTION.connect((err) => {
	if (err) throw err;
	console.log("database connected");
});

module.exports = DBCONNECTION;
