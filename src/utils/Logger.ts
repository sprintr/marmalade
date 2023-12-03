import { createLogger, transports, format } from "winston";

const Logger = createLogger({
	transports: [
		new transports.Console(),
	],
	format: format.combine(
		format.timestamp({
			format: 'YYYY/MM/DD HH:mm:ss.SSS',
		}),
		format.printf(({ timestamp, level, message }) => {
			return `${timestamp} [${level.toUpperCase()}] ${message}`;
		}),
	),
});

if (['test'].includes(process.env.NODE_ENV)) {
	Logger.add(new transports.File({
		filename: 'logs-test.log',
	}));
}

export default Logger;
