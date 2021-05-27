const userModel = require("../models/user");
const { validateEmail, formError, messageHandler } = require("../my_module/utilities")();
const { registrationValidation, loginValidation } = require("../my_module/validation")();
const bcrypt = require("bcrypt");
const saltRounds = 10;

class Users {
	constructor() {}

	index(req, res) {
		res.render("index", {
			message: req.session.message != undefined ? req.session.message : undefined,
			form_errors: req.session.form_errors != undefined ? req.session.form_errors : undefined,
		});
		req.session.destroy();
	}

	create(req, res) {
		let form_error_array = registrationValidation(req.body, validateEmail);

		if (form_error_array.length > 0) {
			req.session.form_errors = formError("register", form_error_array);
			res.redirect("/");
			return false;
		}

		bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
			// check if email is already exist
			req.body.password = hash;
			userModel.findByEmail(req.body.email, function (err, user) {
				// console.log(user.length);
				let message;
				if (user.length > 0) {
					message = messageHandler("error", "Error, email already in the database");
					console.log(message);
				} else {
					let user_data = userModel.userData(req.body);
					console.log(user_data);
					let create_user = userModel.create(user_data);
					console.log(`value ${create_user.values}`);

					message = messageHandler("success", "User has been registered successfully");
				}
				req.session.message = message;
				res.redirect("/");
			});
		});
	}

	login_process(req, res) {
		let form_error_array = loginValidation(req.body, validateEmail);

		if (form_error_array.length > 0) {
			req.session.form_errors = formError("login", form_error_array);
			res.redirect("/");
			return false;
		}

		userModel.findByEmail(req.body.email, function (err, user) {
			if (user.length > 0) {
				//user found

				bcrypt.compare(req.body.password, user[0].password, function (err, result) {
					// result == true
					if (result) {
						console.log("correct credentials");

						req.session.user = user[0];
						res.redirect("/welcome");
					} else {
						// wrong password
						req.session.form_errors = formError("login", ["Wrong Email or Password"]);
						res.redirect("/");
						return false;
					}
				});
			} else {
				// wrong email

				req.session.form_errors = formError("login", ["Wrong Email or Password"]);

				res.redirect("/");
			}
		});
	}

	welcome(req, res) {
		console.log(req.session.user);
		res.render("welcome", { user: req.session.user });
	}

	logoff(req, res) {
		req.session.destroy();
		res.redirect("/");
	}
}

module.exports = new Users();

// email

// const { email, password } = req.body;
// let form_error_array = [];

// if (email == "") {
// 	form_error_array.push("Email field cannot be blank");
// } else if (!validateEmail(email)) {
// 	form_error_array.push("Email should be valid");
// }

// if (password == "") {
// 	form_error_array.push("Password field cannot be blank");
// }

//check for form validation
//object destructure
// const { firstname, lastname, email, password, confirm_password } = req.body;
// let form_error_array = [];

// if (firstname == "") {
// 	form_error_array.push("Firstname field cannot be blank");
// }

// if (lastname == "") {
// 	form_error_array.push("Lastname field cannot be blank");
// }

// if (email == "") {
// 	form_error_array.push("Email field cannot be blank");
// } else if (!validateEmail(email)) {
// 	form_error_array.push("Email should be valid");
// }

// if (password == "") {
// 	form_error_array.push("Password field cannot be blank");
// }

// if (confirm_password == "") {
// 	form_error_array.push("Confirm field cannot be blank");
// }

// if (password != confirm_password) {
// 	form_error_array.push("Password and Confirm password does not match");
// }

// bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
// 	// check if email is already exist
// 	req.body.password = hash;
// 	await userModel.findByEmail(req.body.email, async function (err, user) {
// 		console.log(user.length);
// 		let message = {};
// 		if (user.length > 0) {
// 			message.title = "error";
// 			message.content = "Error, email already in the database";
// 		} else {
// 			let new_user = new userModel(req.body);
// 			let create_user = await userModel.create(new_user);
// 			console.log(`value ${create_user.values}`);
// 			message.title = "success";
// 			message.content = "Success, a new user has been created";
// 		}
// 		req.session.message = message;
// 		res.redirect("/");
// 	});
// });
