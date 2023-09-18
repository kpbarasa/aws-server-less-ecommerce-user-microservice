"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBClient = void 0;
const pg_1 = require("pg");
const DBClient = () => {
    return new pg_1.Client({
        // host: "user-service-rds.cphqx1u503ar.us-east-1.rds.amazonaws.com",
        // user: "user_service",
        // database: "user_service",
        // password: "user_service_2023",
        // port: 5432
        host: "berry.db.elephantsql.com",
        user: "xzlkatew",
        database: "xzlkatew",
        password: "WKi3aCGlWb522ZRMj7X5pjR3PXfj47St",
        port: 5432
    });
};
exports.DBClient = DBClient;
//# sourceMappingURL=databaseClient.js.map