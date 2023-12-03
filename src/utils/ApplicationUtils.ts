import crypto from "crypto";

/**
 * Returns a random UUID
 */
export const getRandomUuid = () => {
	return crypto.randomUUID();
};

/**
 * Returns a random secret
 */
export const getRandomSecret = (): string => {
	return crypto.randomBytes(32).toString('hex');
};
