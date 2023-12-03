import app from "./app";

import sequelize from "./sequelize";

import Logger from "./utils/Logger";

async function start() {
	try {
		// Test the connection by trying to authenticate
		await sequelize.authenticate();

		// Sync all defined models to the DB.
		await sequelize.sync();

		app.listen(process.env.PORT ?? 9001, () => {
			Logger.info(`[Expressjs] Running in ${process.env.NODE_ENV} environment`);
			Logger.info(`[Expressjs] Started listening on ${process.env.PORT ?? 9001}`);
		});
	} catch (e) {
		Logger.error(e);
	}
}

start();
