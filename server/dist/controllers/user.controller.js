"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserRepository_1 = __importDefault(require("../database/Repositories/UserRepository"));
const RequestHandlers_1 = __importDefault(require("../database/RequestHandlers"));
class UserController {
    static registerNewUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield UserRepository_1.default.registerUser(req.body);
                RequestHandlers_1.default.handleRequestSuccess(res, 200)({
                    user: {
                        message: "User Created succesfully! Please Check your email for activation",
                        activation: user === null || user === void 0 ? void 0 : user.activation
                    }
                });
            }
            catch (err) {
                RequestHandlers_1.default.handlRequestFailure(res, 400)({
                    error: err.message,
                });
            }
        });
    }
    static verifyUserEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uniquestring } = req.params;
            console.log("my code " + uniquestring);
            const result = yield UserRepository_1.default.verifyEmail(uniquestring);
            console.log("My result " + JSON.stringify(result));
        });
    }
    static loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield UserRepository_1.default.loginUser(req.body);
                RequestHandlers_1.default.handleRequestSuccess(res, 200)({
                    result,
                });
            }
            catch (error) {
                RequestHandlers_1.default.handlRequestFailure(res, 400)({
                    error: error.message
                });
            }
        });
    }
    static getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield UserRepository_1.default.getUsers();
                RequestHandlers_1.default.handleRequestSuccess(res, 200)({
                    user: user
                });
            }
            catch (error) {
                RequestHandlers_1.default.handlRequestFailure(res, 400)({
                    error: error.message,
                });
            }
        });
    }
    users() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield UserRepository_1.default.fetchUsers();
            return users;
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map