import sequelize from "../src/sequelize";

async function setup() {
	await sequelize.authenticate();
	await sequelize.sync();
}

setup();
