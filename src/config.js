const mysql = require("mysql");

const dbConnection = mysql.createConnection({
	host: `localhost`,
	user: `root`,
	password: `root`,
	database: `express_users`,
});

dbConnection.connect((err) => {
	if (err) throw err;
	console.log("database connected");
});

module.exports = dbConnection;

// class dbConnection {
// 	constructor() {
// 		const DBCONNECTION = MYSQL.createConnection({
// 			host: `localhost`,
// 			user: `root`,
// 			password: `root`,
// 			database: `express_users`,
// 		});

// 		DBCONNECTION.connect((err) => {
// 			if (err) throw err;
// 			console.log("database connected");
// 		});
// 	}
// }

// module.exports = new dbConnection();
