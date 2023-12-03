import fs from "node:fs";
import path from "node:path";

import jsonwebtoken, { JwtPayload } from "jsonwebtoken";

import Logger from "./Logger";

// Load public and private keys for the jwt tokens
// > WARNING: Do not regenerate them unless you know what you are doing!
// > openssl genrsa -out PRIVATE.pem 2048
// > openssl rsa -in PRIVATE.pem -pubout -out PUBLIC.pem
const PRIVATE_KEY = fs.readFileSync(path.join(process.cwd(), "certs", "PRIVATE.pem"), "utf-8");
const PUBLIC_KEY = fs.readFileSync(path.join(process.cwd(), "certs", "PUBLIC.pem"), "utf-8");

/**
 * Generates a jwt token for a given payload
 */
export const generateJwt = (payload: { [key: string]: string | number | boolean | object; }, subject: string): string => {
	let expiresIn: string = '1d';
	try {
		expiresIn = process.env?.JWT_ACCESS_TOKEN_EXPIRES ?? expiresIn;
	} catch (e) {
		Logger.error(e.toString());
	}

	return jsonwebtoken.sign(payload, PRIVATE_KEY, {
		subject: subject,
		expiresIn: expiresIn,
		issuer: process.env.JWT_ISSUER,
		algorithm: 'RS256',
	});
};

/**
 * Verifies the jwt token
 */
export const verifyJwt = (token: string): JwtPayload | string => {
	try {
		return jsonwebtoken.verify(token, PUBLIC_KEY, {
			algorithms: ['RS256'],
		});
	} catch (e) {
		Logger.error(e.toString());
		return null;
	}
};
