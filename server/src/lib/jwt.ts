// sign/verify helpers

import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

/** What we store inside the token. requireAuth reads userId back out. */
export type JwtPayload = { userId: string };

/** env.jwtExpiresIn is a plain string; jsonwebtoken's types expects a
 * narrower type, so we cast it to the option's expected type
 */
const signOptions: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
};

/** Create a signed JWT for a user. */
export function signToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.jwtSecret, signOptions);
}

/** Verify a token and return its paylod.
 * Throws if invalid/expired.
 */
export function verifyToken(token: string): JwtPayload {
    return jwt.verify(token, env.jwtSecret) as JwtPayload;
}
