const userModel = require("../models/users.model");
const { validateEmail } = require("../my_module/utilities")();
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

	async create(req, res) {
		try {
			//check for form validation
			//object destructure
			const { firstname, lastname, email, password, confirm_password } = req.body;
			let form_error_array = [];

			if (firstname == "") {
				form_error_array.push("Firstname field cannot be blank");
			}

			if (lastname == "") {
				form_error_array.push("Lastname field cannot be blank");
			}

			if (email == "") {
				form_error_array.push("Email field cannot be blank");
			} else if (!validateEmail(email)) {
				form_error_array.push("Email should be valid");
			}

			if (password == "") {
				form_error_array.push("Password field cannot be blank");
			}

			if (confirm_password == "") {
				form_error_array.push("Confirm field cannot be blank");
			}

			if (password != confirm_password) {
				form_error_array.push("Password and Confirm password does not match");
			}

			if (form_error_array.length > 0) {
				// req.session.form_errors = form_error_array;
				let form_error = {
					type: "register",
					errors: form_error_array,
				};
				// req.session.form_errors = form_error_array;
				req.session.form_errors = form_error;
				res.redirect("/");
				return false;
			}

			bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
				// check if email is already exist
				req.body.password = hash;
				await userModel.findByEmail(req.body.email, async function (err, user) {
					console.log(user.length);
					let message = {};
					if (user.length > 0) {
						message.title = "error";
						message.content = "Error, email already in the database";
					} else {
						let new_user = new userModel(req.body);
						let create_user = await userModel.create(new_user);
						console.log(`value ${create_user.values}`);
						message.title = "success";
						message.content = "Success, a new user has been created";
					}
					req.session.message = message;
					res.redirect("/");
				});
			});
		} catch (error) {
			console.log(error);
		}
	}

	async login_process(req, res) {
		try {
			// email

			const { email, password } = req.body;
			let form_error_array = [];

			if (email == "") {
				form_error_array.push("Email field cannot be blank");
			} else if (!validateEmail(email)) {
				form_error_array.push("Email should be valid");
			}

			if (password == "") {
				form_error_array.push("Password field cannot be blank");
			}

			if (form_error_array.length > 0) {
				let form_error = {
					type: "login",
					errors: form_error_array,
				};
				// req.session.form_errors = form_error_array;
				req.session.form_errors = form_error;
				res.redirect("/");
				return false;
			}

			await userModel.findByEmail(req.body.email, async function (err, user) {
				if (user.length > 0) {
					//user found

					bcrypt.compare(req.body.password, user[0].password, function (err, result) {
						// result == true
						if (result) {
							console.log("correct credentials");
							// console.log(user);
							// res.send(user);
							req.session.user = user[0];
							res.redirect("/welcome");
						} else {
							console.log("wrong password");
						}
					});
				} else {
					console.log("incorrect email");
				}
			});
		} catch (error) {}
	}

	async welcome(req, res) {
		console.log(req.session.user);
		res.render("welcome", { user: req.session.user });
	}

	logoff(req, res) {
		req.session.destroy();
		res.redirect("/");
	}
}

module.exports = { Users };
