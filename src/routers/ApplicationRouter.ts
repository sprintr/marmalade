import type {
	Request,
	Response,
} from "express";

import type User from "../models/User";

import express from "express";

import UserRepository from "../repositories/UserRepository";
import ApplicationRepository from "../repositories/ApplicationRepository";

import ApplicationService from "../services/ApplicationService";

import ApplicationValidator from "../validators/ApplicationValidator";

import AuthRequired from "../middleware/AuthRequired";

import Logger from "../utils/Logger";

const userRepository = new UserRepository();

const applicationRepository = new ApplicationRepository();

const applicationService = new ApplicationService(applicationRepository);

const applicationValidator = new ApplicationValidator(applicationRepository);

/**
 * Creates an application
 */
const actionCreateApplication = async (
	req: Request & {
		auth: {
			user: User,
		},
	},
	res: Response,
) => {
	const response = await applicationValidator.validateCreateApplication(req.auth, req.body);
	if (!response.isOk) {
		res.status(400).json({
			status: "fail",
			errors: response?.errors,
		});
		return;
	}

	try {
		const application = await applicationService.createApplication(req?.body);
		res.status(201).json({
			status: "success",
			data: application,
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
 * Retrieves a list of applications
 */
const actionGetApplications = async (
	req: Request & {
		query: {
			filters: string;
			orderBy: string;
			pageNumber: string;
			itemsPerPage: string;
		},
	},
	res: Response,
) => {
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
		const applications = await applicationService.getAllApplications(filters, orderBy, pageNumber, itemsPerPage);
		res.status(200).json({
			status: "success",
			data: applications,
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
 * Retrieves an application
 */
const actionGetApplication = async (req: Request, res: Response) => {
	let applicationId = 0;
	try {
		applicationId = parseInt(req?.params?.applicationId) ?? 0;
	} catch (e) {
		Logger.error(e.toString());
	}

	try {
		const application = await applicationService.getApplication(applicationId);
		if (application) {
			res.status(200).json({
				status: "success",
				data: application,
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
 * Updates an application
 */
const actionUpdateApplication = async (
	req: Request & {
		auth: {
			user: User,
		},
	},
	res: Response,
) => {
	let applicationId = 0;
	try {
		applicationId = parseInt(req?.params?.applicationId) ?? 0;
	} catch (e) {
		Logger.error(e.toString());
	}

	const response = await applicationValidator.validateUpdateApplication(req.auth, applicationId, req.body);
	if (!response.isOk) {
		res.status(400).json({
			status: "fail",
			errors: response?.errors,
		});
		return;
	}

	try {
		await applicationService.updateApplication(applicationId, req.body);
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
 * Updates the credentials of an application
 */
const actionUpdateApplicationCredentials = async (req: Request, res: Response) => {
	let applicationId = 0;
	try {
		applicationId = parseInt(req?.params?.applicationId) ?? 0;
	} catch (e) {
		Logger.error(e.toString());
	}

	try {
		await applicationService.updateApplicationCredentials(applicationId);
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
 * Deletes an application
 */
const actionDeleteApplication = async (req: Request, res: Response) => {
	let applicationId = 0;
	try {
		applicationId = parseInt(req?.params?.applicationId) ?? 0;
	} catch (e) {
		Logger.error(e.toString());
	}

	try {
		await applicationService.deleteApplication(applicationId);
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

const router = express.Router();
router.post("/", AuthRequired(userRepository, applicationRepository), actionCreateApplication);
router.get("/", AuthRequired(userRepository, applicationRepository), actionGetApplications);
router.get("/:applicationId", AuthRequired(userRepository, applicationRepository), actionGetApplication);
router.put("/:applicationId", AuthRequired(userRepository, applicationRepository), actionUpdateApplication);
router.put("/:applicationId/credentials", AuthRequired(userRepository, applicationRepository), actionUpdateApplicationCredentials);
router.delete("/:applicationId", AuthRequired(userRepository, applicationRepository), actionDeleteApplication);

export default router;
