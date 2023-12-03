import type { Request, Response } from "express";

import express from "express";

import UserRepository from "../repositories/UserRepository";

import AuthValidator from "../validators/AuthValidator";

import AuthService from "../services/AuthService";

import Logger from "../utils/Logger";

const userRepository = new UserRepository();

const authService = new AuthService(userRepository);

const authValidator = new AuthValidator(userRepository);

/**
 * Sign Up
 */
const actionSignUp = async (req: Request, res: Response) => {
	const response = await authValidator.validateSignUp(req.body);
	if (!response.isOk) {
		res.status(400).json({
			status: "fail",
			errors: response?.errors,
		});
		return;
	}

	try {
		const data = await authService.signUp(req.body);
		res.status(201).json({
			status: "success",
			data: data,
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
 * Sign In
 */
const actionSignIn = async (req: Request, res: Response) => {
	const response = await authValidator.validateSignIn(req.body);
	if (!response.isOk) {
		res.status(400).json({
			status: "fail",
			errors: response?.errors,
		});
		return;
	}

	try {
		const data = await authService.signIn(req.body);
		res.status(201).json({
			status: "success",
			data: data,
		});
	} catch (e) {
		Logger.error(e);
		res.status(400).json({
			status: "fail",
			errors: e?.errors,
		});
	}
};

const router = express.Router();
router.post("/sign-up", actionSignUp);
router.post("/sign-in", actionSignIn);

export default router;
