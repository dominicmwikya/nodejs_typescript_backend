"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const typeorm_1 = require("typeorm");
const User_entity_1 = require("./entities/User.entity");
const Role_entity_1 = require("./entities/Role.entity");
const Product_entity_1 = require("./entities/Product.entity");
const Profile_entity_1 = require("./entities/Profile.entity");
require("reflect-metadata");
exports.databaseConfig = new typeorm_1.DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "@Devtech@21",
    database: "typedb",
    synchronize: true,
    logging: true,
    entities: [User_entity_1.User, Role_entity_1.Role, Product_entity_1.Product, Profile_entity_1.Profile],
    cache: true
});
exports.databaseConfig.initialize()
    .then(() => {
    console.log("Data Source has been initialized");
})
    .catch((err) => {
    console.log(`Error occured during initialization`, err);
});
//# sourceMappingURL=dbconfig.js.map