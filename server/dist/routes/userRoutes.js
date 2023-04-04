"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const UserSchema_1 = require("../middlewares/ValidationSchemas/UserSchema");
const authGuard_1 = require("../middlewares/Guards/authGuard");
const userRoutes = express_1.default.Router();
exports.userRoutes = userRoutes;
userRoutes.get('/', user_controller_1.UserController.getUsers);
userRoutes.post('/create', UserSchema_1.joiValidate, user_controller_1.UserController.registerNewUser);
userRoutes.post('/login', UserSchema_1.joiValidateLogin, user_controller_1.UserController.loginUser);
userRoutes.get('/verify/:uniquestring', user_controller_1.UserController.verifyUserEmail);
userRoutes.get('/protected-route', authGuard_1.authGuard.verifyUserToken, (req, res) => {
    // Access the user object attached to the request
    const user = req.user;
    res.status(200).json({
        usermail: user.payload.email,
        name: user.payload.name,
        id: user.payload.id,
        authStatus: true,
        message: `${user.payload.email} is Authenticated`
    });
});
//# sourceMappingURL=userRoutes.js.map