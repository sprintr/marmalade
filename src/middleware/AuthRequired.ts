import type { Request, Response, NextFunction } from "express";

import User, { Status as UserStatus } from "../models/User";
import Application, { Status as ApplicationStatus } from "../models/Application";

import UserRepository from "../repositories/UserRepository";
import ApplicationRepository from "../repositories/ApplicationRepository";

import {
	verifyJwt,
} from "../utils/JwtUtils";

/**
 * Determines if the user/application has the required authentication
 */
export default (
	userRepository: UserRepository,
	applicationRepository: ApplicationRepository,
) => {
	return async (
		req: Request & {
			auth: {
				user?: User,
				application?: Application,
			},
		},
		res: Response,
		next: NextFunction,
	) => {
		// Get the authorization header.
		const authorization = req?.headers?.authorization;
		if (!authorization) {
			res.status(401).json({
				status: "fail",
			});
			return;
		}

		// Get the access token from the header.
		const fragments = authorization.split(" ").filter(fragment => fragment.length !== 0);
		if (!fragments || fragments.length !== 2 || fragments[0] !== 'Bearer') {
			res.status(401).json({
				status: "fail",
			});
			return;
		}

		// Verify and parse the payload of the JWT
		const payload = verifyJwt(fragments[1]);
		if (!payload) {
			res.status(401).json({
				status: "fail",
			});
			return;
		}

		// Find the user and set it in the request auth.
		if (payload["userId"]) {
			const user = await userRepository.findById(payload["userId"]);
			if (user && user.status === UserStatus.Active) {
				req.auth = {
					user: user,
				};
				next();
				return;
			}
		}

		// Find the application and set it in the request auth.
		if (payload["clientId"]) {
			const application = await applicationRepository.findByClientId(payload["clientId"]);
			if (application && application.status === ApplicationStatus.Active) {
				req.auth = {
					application: application,
				};
				next();
				return;
			}
		}

		// It ends here.
		res.status(401).send({
			status: "fail",
		});
	};
};
