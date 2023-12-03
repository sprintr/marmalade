import bcrypt from "bcryptjs";

/**
 * Hashes the password
 */
export const hash = (password: string): string => {
	return bcrypt.hashSync(password, 10);
};

/**
 * Verifies the password against its hash
 */
export const compare = (password: string, hash: string): boolean => {
	return bcrypt.compareSync(password, hash);
};
