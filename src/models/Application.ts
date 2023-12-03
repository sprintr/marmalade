import {
	Table,
	Column,
	PrimaryKey,
	AutoIncrement,
	Model,
	DataType,
} from "sequelize-typescript";

export enum Status {
	Active = "Active",
	Inactive = "Inactive",
	Banned = "Banned",
}

@Table({
	modelName: 'Application',
	timestamps: true,
	charset: 'utf8',
	collate: 'utf8_unicode_ci',
	indexes: [
		{
			unique: true,
			fields: ['clientId'],
		},
	],
})
class Application extends Model {
	@PrimaryKey
	@AutoIncrement
	@Column({
		type: DataType.BIGINT,
		allowNull: false,
	})
	id: number;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	name: string;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	homepage: string;

	@Column({
		type: DataType.STRING,
		allowNull: true,
	})
	description: string;

	@Column({
		type: DataType.UUID,
		allowNull: false,
		unique: true,
	})
	clientId: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	clientSecret: string;

	@Column({
		type: DataType.DATE,
		allowNull: false,
	})
	clientCredentialsUpdatedAt: Date;

	@Column({
		type: DataType.ENUM(
			Status.Active,
			Status.Inactive,
			Status.Banned,
		),
		allowNull: false,
		defaultValue: Status.Active,
	})
	status: string;
}

export default Application;
