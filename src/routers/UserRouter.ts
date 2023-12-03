import type { Request, Response } from "express";

import type User from "../models/User";

import { Router } from "express";

import UserRepository from "../repositories/UserRepository";

import ApplicationRepository from "../repositories/ApplicationRepository";

import UserService from "../services/UserService";

import UserValidator from "../validators/UserValidator";

import AuthRequired from "../middleware/AuthRequired";

import Logger from "../utils/Logger";

const userRepository = new UserRepository();

const applicationRepository = new ApplicationRepository();

const userService = new UserService(userRepository);

const userValidator = new UserValidator(userRepository);

/**
 * Creates a user
 */
const actionCreateUser = async (
	req: Request & {
		auth: {
			user: User,
		},
	},
	res: Response,
) => {
	const response = await userValidator.validateCreateUser(req.auth, req.body);
	if (!response.isOk) {
		res.status(400).json({
			status: "fail",
			errors: response?.errors,
		});
		return;
	}

	try {
		const user = await userService.createUser(req.body);
		res.status(201).json({
			status: "success",
			data: user,
		});
	} catch (e) {
		Logger.error(e.toString());
		res.status(400).json({
			status: "fail",
			errors: e?.errors,
		});
	}
};

/**
 * Retrieves the users
 */
const actionGetUsers = async (
	req: Request & {
		query: {
			filters: string;
			orderBy: string;
			pageNumber: string;
			itemsPerPage: string;
		},
		auth: {
			user: User,
		},
	},
	res: Response,
) => {
	const response = await userValidator.validateGetUsers(req?.auth);
	if (!response.isOk) {
		res.status(400).json({
			status: "fail",
			errors: response?.errors,
		});
		return;
	}

	let filters = {},
		orderBy: string = "desc",
		pageNumber: number = 0,
		itemsPerPage: number = 30;

	try {
		filters = JSON.parse(req?.query?.filters ?? "");
		orderBy = req?.query?.orderBy ?? orderBy;
		pageNumber = parseInt(req?.query?.pageNumber) ?? pageNumber;
		itemsPerPage = parseInt(req?.query?.itemsPerPage) ?? itemsPerPage;
	} catch (e) {
		Logger.error(e.toString());
	}

	try {
		const users = await userService.getAllUsers(filters, orderBy, pageNumber, itemsPerPage);
		res.status(200).json({
			status: "success",
			data: users,
		});
	} catch (e) {
		Logger.error(e.toString());
		res.status(400).json({
			status: "fail",
			errors: e?.errors,
		});
	}
};

/**
 * Retrieves a single user
 */
const actionGetUser = async (
	req: Request & {
		auth: {
			user: User,
		},
	},
	res: Response,
) => {
	let userId = 0;
	try {
		userId = parseInt(req?.params?.userId) ?? userId;
	} catch (e) {
		Logger.error(e.toString());
	}

	const response = await userValidator.validateGetUser(req?.auth, userId);
	if (!response.isOk) {
		res.status(400).json({
			status: "fail",
			errors: response?.errors,
		});
		return;
	}

	try {
		const user = await userService.getUser(userId);
		if (user) {
			res.status(200).json({
				status: "success",
				data: user,
			});
		} else {
			res.status(404).json({
				status: "fail",
			});
		}
	} catch (e) {
		Logger.error(e.toString());
		res.status(400).json({
			status: "fail",
			errors: e?.errors,
		});
	}
};

/**
 * Updates a user
 */
const actionUpdateUser = async (
	req: Request & {
		auth: {
			user: User,
		},
	},
	res: Response,
) => {
	let userId = 0;
	try {
		userId = parseInt(req?.params?.userId) ?? userId;
	} catch (e) {
		Logger.error(e.toString());
	}

	const response = await userValidator.validateUpdateUser(req?.auth, userId, req?.body);
	if (!response.isOk) {
		res.status(400).json({
			status: "fail",
			errors: response?.errors,
		});
		return;
	}

	try {
		await userService.updateUser(userId, req?.body);
		res.status(200).json({
			status: "success",
		});
	} catch (e) {
		Logger.error(e.toString());
		res.status(400).json({
			status: "fail",
			errors: e?.errors,
		});
	}
};

/**
 * Updates a user's password
 */
const actionUpdateUserPassword = async (
	req: Request & {
		auth: {
			user: User,
		},
	},
	res: Response,
) => {
	let userId = 0;
	try {
		userId = parseInt(req?.params?.userId) ?? userId;
	} catch (e) {
		Logger.error(e.toString());
	}

	const response = await userValidator.validateUpdateUserPassword(req?.auth, userId, req?.body);
	if (!response.isOk) {
		res.status(400).json({
			status: "fail",
			errors: response?.errors,
		});
		return;
	}

	try {
		await userService.updateUserPassword(userId, req?.body);
		res.status(200).json({
			status: "success",
		});
	} catch (e) {
		Logger.error(e.toString());
		res.status(400).json({
			status: "fail",
			errors: e?.errors,
		});
	}
};

/**
 * Updates a user's role
 */
const actionUpdateUserRole = async (
	req: Request & {
		auth: {
			user: User,
		},
	},
	res: Response,
) => {
	let userId = 0;
	try {
		userId = parseInt(req?.params?.userId) ?? userId;
	} catch (e) {
		Logger.error(e.toString());
	}

	const response = await userValidator.validateUpdateUserRole(req?.auth, userId, req?.body);
	if (!response.isOk) {
		res.status(400).json({
			status: "fail",
			errors: response?.errors,
		});
		return;
	}

	try {
		await userService.updateUserRole(userId, req?.body);
		res.status(200).json({
			status: "success",
		});
	} catch (e) {
		Logger.error(e.toString());
		res.status(400).json({
			status: "fail",
			errors: e?.errors,
		});
	}
};

/**
 * Updates a user's status
 */
const actionUpdateUserStatus = async (
	req: Request & {
		auth: {
			user: User,
		},
	},
	res: Response,
) => {
	let userId = 0;
	try {
		userId = parseInt(req?.params?.userId) ?? userId;
	} catch (e) {
		Logger.error(e.toString());
	}

	const response = await userValidator.validateUpdateUserStatus(req?.auth, userId, req?.body);
	if (!response.isOk) {
		res.status(400).json({
			status: "fail",
			errors: response?.errors,
		});
		return;
	}

	try {
		await userService.updateUserStatus(userId, req?.body);
		res.status(200).json({
			status: "success",
		});
	} catch (e) {
		Logger.error(e.toString());
		res.status(400).json({
			status: "fail",
			errors: e?.errors,
		});
	}
};

/**
 * Deletes a user
 */
const actionDeleteUser = async (
	req: Request & {
		auth: {
			user: User,
		},
	},
	res: Response,
) => {
	let userId = 0;
	try {
		userId = parseInt(req?.params?.userId) ?? userId;
	} catch (e) {
		Logger.error(e.toString());
	}

	const response = await userValidator.validateDeleteUser(req?.auth, userId);
	if (!response.isOk) {
		res.status(400).json({
			status: "fail",
			errors: response?.errors,
		});
		return;
	}

	try {
		await userService.deleteUser(userId);
		res.status(200).json({
			status: "success",
		});
	} catch (e) {
		Logger.error(e.toString());
		res.status(400).json({
			status: "fail",
			errors: e?.errors,
		});
	}
};

const router = Router();
router.post("/", AuthRequired(userRepository, applicationRepository), actionCreateUser);
router.get("/", AuthRequired(userRepository, applicationRepository), actionGetUsers);
router.get("/:userId", AuthRequired(userRepository, applicationRepository), actionGetUser);
router.put("/:userId", AuthRequired(userRepository, applicationRepository), actionUpdateUser);
router.put("/:userId/password", AuthRequired(userRepository, applicationRepository), actionUpdateUserPassword);
router.put("/:userId/role", AuthRequired(userRepository, applicationRepository), actionUpdateUserRole);
router.put("/:userId/status", AuthRequired(userRepository, applicationRepository), actionUpdateUserStatus);
router.delete("/:userId", AuthRequired(userRepository, applicationRepository), actionDeleteUser);

export default router;
