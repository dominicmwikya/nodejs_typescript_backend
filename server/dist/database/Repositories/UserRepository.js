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
const User_entity_1 = require("../entities/User.entity");
const dbconfig_1 = require("../dbconfig");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mail_service_1 = require("../../helpers/mail.service");
class UserRepository {
    /*
       pass @params string; user password input.
       return string result.
    */
    static passwordEncrypt(password) {
        const saltRounds = 10;
        const salt = bcrypt_1.default.genSaltSync(saltRounds);
        return bcrypt_1.default.hashSync(password, salt);
    }
    static passwordDecrypt(password, user) {
        return bcrypt_1.default.compareSync(password, user.password);
    }
    static generateUserToken(user) {
        try {
            const expirationTimeInSeconds = 60 * 60; // 1 hour in seconds
            const currentTime = Math.floor(Date.now() / 1000); // Convert milliseconds to seconds
            const expirationTime = currentTime + expirationTimeInSeconds;
            const my_secret_key = process.env.SECRET_KEY_API_KEY;
            const payload = {
                id: user.id,
                email: user.email,
                name: user.firstName + ' ' + user.lastName,
            };
            const token = jsonwebtoken_1.default.sign({ payload, exp: expirationTime }, my_secret_key);
            return { accessToken: token, expirytime: expirationTime, user: payload };
        }
        catch (error) {
            return { error: error };
        }
    }
    static generateRandomString() {
        return Math.random().toString(36).slice(2, 9);
    }
    static registerUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const exists = yield this.UserRepo.findOneBy({
                email: user.email,
            });
            if (!exists) {
                user.password = this.passwordEncrypt(user.password);
                user.code = this.generateRandomString();
                let uniquestring = user.code;
                const mailService = new mail_service_1.Mailservice();
                yield mailService.sendEmail(user.email, 'Email Confirmation', `<a href='http://localhost:8000/users/verify/${uniquestring}'> click here </a>`);
                return this.UserRepo.save(user);
            }
            throw new Error(' User already exists! Choose new email');
        });
    }
    static verifyEmail(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const userResult = yield this.UserRepo.find({ where: { code: code } });
            if (userResult) {
                userResult[0].activation = true;
                yield this.UserRepo.save(userResult);
                const mailService = new mail_service_1.Mailservice();
                yield mailService.sendEmail(userResult[0].email, 'Account activated successfully! Click here to login', `<a href=http://localhost:3001/login> Login here </a>`);
            }
            else {
                return { error: 'User Not found! Contact system admin' };
            }
        });
    }
    static loginUser(userdetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const userExists = yield this.UserRepo.find({ where: { email: userdetails.email } });
            if (!userExists[0]) {
                throw new Error(`user with email ${userdetails.email} doesnt exist`);
            }
            const confirmpassword = this.passwordDecrypt(userdetails.password, userExists[0]);
            if (!confirmpassword) {
                throw new Error("Invalid login details! Try again");
            }
            const generatedAccessToken = this.generateUserToken(userExists[0]);
            return {
                token: generatedAccessToken,
                authState: true,
                message: `User Login sucessfull! Welcome ${userExists[0].firstName}`,
            };
        });
    }
    static getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.UserRepo.find({ select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    activation: true
                },
                order: {
                    lastName: 'ASC'
                },
                cache: true
            });
            return users;
        });
    }
    static fetchUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            /* none static method accessing the UserRepo */
            return yield this.UserRepo.find({ select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true
                } });
        });
    }
}
exports.default = UserRepository;
/*
  create custom private UserRepo
*/
UserRepository.UserRepo = dbconfig_1.databaseConfig.getRepository(User_entity_1.User);
//# sourceMappingURL=UserRepository.js.map