const dbConnection = require("../config");

class User {
	constructor() {
		// this.first_name = user.firstname;
		// this.last_name = user.lastname;
		// this.email = user.email;
		// this.password = user.password;
		this.user = {};
		this.created_at = new Date();
	}

	// set's user data and return this.user with first_name etc
	// trying to use the getters and setters before, failed to implement it
	userData(user) {
		let data = {
			first_name: user.firstname,
			last_name: user.lastname,
			email: user.email,
			password: user.password,
			created_at: this.created_at,
		};
		this.user = data;
		return this.user;
	}

	create(newUser) {
		return dbConnection.query(
			"INSERT INTO users (first_name,last_name,email,password,created_at) VALUES (?,?,?,?,?)",
			[newUser.first_name, newUser.last_name, newUser.email, newUser.password, newUser.created_at],
			function (err, res) {
				if (err) {
					// console.log("error: ", err);
					return err;
					// callback(err, null);
				} else {
					// console.log(res.insertId);
					return res;
					// callback(null, res.insertId);
				}
			}
		);
	}

	findByEmail(email, result) {
		dbConnection.query("SELECT * FROM users WHERE email = ? ", email, function (err, res) {
			if (err) {
				// return err;

				result(null, err);
			} else {
				result(null, res);
				// console.log(res);
			}
		});
	}
}

module.exports = new User();

// let user = function (user) {
// 	this.first_name = user.firstname;
// 	this.last_name = user.lastname;
// 	this.email = user.email;
// 	this.password = user.password;
// 	this.created_at = new Date();
// 	// this.updated_at = new Date();
// };

// user.create = function (newUser) {
// 	// MySQL-specific extension to the SQL syntax;
// 	return dbConnection.query(
// 		"INSERT INTO users (first_name,last_name,email,password,created_at) VALUES (?,?,?,?,?)",
// 		[newUser.first_name, newUser.last_name, newUser.email, newUser.password, newUser.created_at],
// 		function (err, res) {
// 			if (err) {
// 				// console.log("error: ", err);
// 				return err;
// 				// callback(err, null);
// 			} else {
// 				// console.log(res.insertId);
// 				return res;
// 				// callback(null, res.insertId);
// 			}
// 		}
// 	);
// };

// user.findByEmail = function (email, result) {
// 	dbConnection.query("SELECT * FROM users WHERE email = ? ", email, function (err, res) {
// 		if (err) {
// 			// return err;

// 			result(null, err);
// 		} else {
// 			result(null, res);
// 			console.log(res);
// 		}
// 	});
// };

// module.exports = user;
