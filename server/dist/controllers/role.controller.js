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
exports.RoleController = void 0;
const roleRepository_1 = __importDefault(require("../database/Repositories/roleRepository"));
const RequestHandlers_1 = __importDefault(require("../database/RequestHandlers"));
class RoleController {
    static getRoles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roles = yield roleRepository_1.default.fetchRoles();
                RequestHandlers_1.default.handleRequestSuccess(res, 200)({
                    roles
                });
            }
            catch (error) {
                RequestHandlers_1.default.handlRequestFailure(res, 401)({
                    error: error.message
                });
            }
        });
    }
}
exports.RoleController = RoleController;
//# sourceMappingURL=role.controller.js.map