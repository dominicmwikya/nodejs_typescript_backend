"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleRoutes = void 0;
const express_1 = require("express");
const role_controller_1 = require("../controllers/role.controller");
const roleRoutes = (0, express_1.Router)();
exports.roleRoutes = roleRoutes;
roleRoutes.get('/', role_controller_1.RoleController.getRoles);
//# sourceMappingURL=roleRoutes.js.map