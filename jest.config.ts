import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
	preset: "ts-jest",
	testEnvironment: "node",
	verbose: true,
	setupFiles: [
		'dotenv-flow/config',
		'./test/setup.ts',
	],
};

export default config;
