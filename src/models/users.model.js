const DBCONNECTION = require("../config");

let user = function (user) {
	this.first_name = user.firstname;
	this.last_name = user.lastname;
	this.email = user.email;
	this.password = user.password;
	this.created_at = new Date();
	// this.updated_at = new Date();
};

user.create = function (newUser) {
	// MySQL-specific extension to the SQL syntax;
	return DBCONNECTION.query(
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
};

user.findAll = function (result) {
	DBCONNECTION.query("SELECT * FROM express_users.users", function (err, res) {
		if (err) {
			// return err;

			result(null, err);
		} else {
			result(null, res);
		}
	});
};

user.findByEmail = function (email, result) {
	DBCONNECTION.query("SELECT * FROM users WHERE email = ? ", email, function (err, res) {
		if (err) {
			// return err;

			result(null, err);
		} else {
			result(null, res);
			console.log(res);
		}
	});
};

module.exports = user;
