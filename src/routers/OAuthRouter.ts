import type { Request, Response } from "express";

import { Router } from "express";

import ApplicationRepository from "../repositories/ApplicationRepository";

import OAuthValidator from "../validators/OAuthValidator";

import OAuthService from "../services/OAuthService";

const applicationRepository = new ApplicationRepository();

const oauthValidator = new OAuthValidator(applicationRepository);

const oauthService = new OAuthService(applicationRepository);

import Logger from "../utils/Logger";

/**
 * Returns an access token for a client
 */
const actionGetAccessToken = async (req: Request, res: Response) => {
	const response = await oauthValidator.validateGetAccessToken(req?.body);
	if (!response.isOk) {
		res.status(400).json(response.errors);
		return;
	}

	try {
		const data = await oauthService.getAccessToken(req?.body);
		res.status(200)
			.header('Cache-Control', 'no-store')
			.json(data);
	} catch (e) {
		Logger.error(e.toString());
		res.status(400).json({
			error: "ERROR",
			error_description: "Something went wrong.",
		});
	}
};

const router = Router();
router.post("/access_token", actionGetAccessToken);

export default router;
