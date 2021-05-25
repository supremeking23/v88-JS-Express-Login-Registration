module.exports = (APP) => {
	const USERSCONTROLLER = require("./controllers/users.controller");
	const user = new USERSCONTROLLER.Users();

	APP.get("/", user.index);

	// APP.get("/register-and-login", user.register);

	APP.get("/welcome", user.welcome);

	APP.post("/create", user.create);
	APP.post("/login_process", user.login_process);

	APP.get("/welcome", user.welcome);
	APP.get("/logoff", user.logoff);
};
