"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuard = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const RequestHandlers_1 = __importDefault(require("../../database/RequestHandlers"));
class authGuard {
    static verifyUserToken(req, res, next) {
        try {
            const { headers: { authorization } } = req;
            if (!authorization)
                throw new Error("No authentication was provided");
            const token = authorization === null || authorization === void 0 ? void 0 : authorization.split(" ")[1];
            if (!token) {
                throw new Error("Invalid aunthentication headers");
            }
            const my_secret_key = process.env.SECRET_KEY_API_KEY;
            jsonwebtoken_1.default.verify(token, my_secret_key, (error, user) => {
                if (error) {
                    throw new Error(error.message);
                }
                else {
                    // @ts-ignore
                    req.user = user;
                }
            });
            return next();
        }
        catch (error) {
            RequestHandlers_1.default.handlRequestFailure(res, 401)({
                message: error.message,
                authStatus: false
            });
        }
    }
}
exports.authGuard = authGuard;
//# sourceMappingURL=authGuard.js.map