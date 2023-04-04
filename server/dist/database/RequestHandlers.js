"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RequestUtils {
    static handleRequestSuccess(res, statusCode = 200) {
        return (body) => {
            res.status(statusCode).send(Object.assign({ status: statusCode, success: true }, body));
        };
    }
    static handlRequestFailure(res, statusCode = 400) {
        return (body) => {
            res.status(statusCode).send(Object.assign({ status: statusCode, success: false }, body));
        };
    }
}
exports.default = RequestUtils;
//# sourceMappingURL=RequestHandlers.js.map