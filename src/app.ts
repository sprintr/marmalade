import express from "express";
import morgan from "morgan";

import oAuthRouter from "./routers/OAuthRouter";

import authRouter from "./routers/AuthRouter";
import userRouter from "./routers/UserRouter";
import applicationRouter from "./routers/ApplicationRouter";

import Logger from "./utils/Logger";

const app = express();
app.use(morgan(`":method :url" :status - :response-time ms - :remote-addr ":user-agent"`, {
	stream: {
		write: function (message: string) {
			Logger.info(message.substring(0, message.length - 1));
		},
	},
}));

app.use(express.json());
app.use(express.urlencoded({
	extended: true,
}));

// Allow express to accept cross-origin requests
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	next();
});

app.use("/oauth", oAuthRouter);

app.use("/v1/auth", authRouter);
app.use("/v1/users", userRouter);
app.use("/v1/applications", applicationRouter);

app.use((req, res) => {
	res.status(404).json({
		status: "fail",
	});
});

export default app;
