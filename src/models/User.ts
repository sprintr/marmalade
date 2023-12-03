import {
	Table,
	Column,
	PrimaryKey,
	AutoIncrement,
	Model,
	DataType,
} from "sequelize-typescript";

export enum Role {
	SuperAdmin = "SuperAdmin",
	StaffAdmin = "StaffAdmin",
	ManagerAdmin = "ManagerAdmin",
}

export enum Status {
	Active = "Active",
	Inactive = "Inactive",
	Banned = "Banned",
}

@Table({
	modelName: "User",
	timestamps: true,
	charset: "utf8",
	collate: "utf8_unicode_ci",
	indexes: [
		{
			unique: true,
			fields: ['emailAddress'],
		},
	],
})
class User extends Model {
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
		allowNull: false,
		unique: true,
	})
	emailAddress: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	password: string;

	@Column({
		type: DataType.ENUM(
			Role.SuperAdmin,
			Role.StaffAdmin,
			Role.ManagerAdmin,
		),
		allowNull: false,
		defaultValue: Role.SuperAdmin,
	})
	role: Role;

	@Column({
		type: DataType.ENUM(
			Status.Active,
			Status.Inactive,
			Status.Banned,
		),
		allowNull: false,
		defaultValue: Status.Active,
	})
	status: Status;
}

User.prototype.toJSON = function () {
	const values = Object.assign({}, this.get());
	delete values.password;
	return values;
};

export default User;
