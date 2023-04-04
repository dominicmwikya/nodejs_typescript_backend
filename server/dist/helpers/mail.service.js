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
exports.Mailservice = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class Mailservice {
    constructor() {
        this.testAccount = null;
    }
    createTestAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield nodemailer_1.default.createTestAccount();
        });
    }
    createTransport() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.testAccount) {
                this.testAccount = yield this.createTestAccount();
            }
            return nodemailer_1.default.createTransport({
                host: process.env.SMTP_HOST,
                port: 587,
                secure: false,
                auth: {
                    user: "dominicmwikya50@gmail.com",
                    pass: "yfvhkdvleyrpkgak",
                },
            });
        });
    }
    mailOptions(to, subject, html) {
        if (!this.testAccount) {
            throw new Error("Test account not initialized");
        }
        return {
            from: "dominicmwikya50@gmail.com",
            to: to,
            subject: subject,
            html: html,
        };
    }
    sendEmail(to, subject, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const transport = yield this.createTransport();
            try {
                const info = yield transport.sendMail(this.mailOptions(to, subject, body));
                console.log(`Email sent: ${info.response}`);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.Mailservice = Mailservice;
//# sourceMappingURL=mail.service.js.map