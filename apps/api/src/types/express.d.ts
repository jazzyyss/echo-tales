import type { AccessTokenPayload } from "../lib/security/jwt.js";

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

export {};
