import { Sequelize } from "sequelize-typescript";

import User from "./models/User";
import Application from "./models/Application";

// Get the port of MySQL server
let port = 3306;
if (process.env?.MYSQL_PORT) {
	port = parseInt(process.env.MYSQL_PORT);
}

// Get the dialect of the SQL service.
let dialect = 'mysql';
switch (process.env?.SEQUELIZE_DIALECT) {
	case 'mysql':
		dialect = 'mysql';
		break;

	case 'sqlite':
	default:
		dialect = 'sqlite';
}

// Initiate Sequelize
const sequelize = dialect === 'sqlite'
	? new Sequelize({
		dialect: 'sqlite',
		storage: process.env?.SQLITE_STORAGE,
		logging: false,
		models: [
			User,
			Application,
		],
	})
	: new Sequelize(process.env?.MYSQL_DATABASE, process.env?.MYSQL_USER, process.env?.MYSQL_PASSWORD, {
		dialect: 'mysql',
		logging: false,
		host: process.env?.MYSQL_HOST,
		port: port,
		models: [
			User,
			Application,
		],
	});

export default sequelize;
