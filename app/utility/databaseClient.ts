import { Client } from "pg";

export const DBClient = () => {
    return new Client({
        // host: "user-service-rds.cphqx1u503ar.us-east-1.rds.amazonaws.com",
        // user: "user_service",
        // database: "user_service",
        // password: "user_service_2023",
        // port: 5432
        host:"isilo.db.elephantsql.com",
        user:"fwtdhqnb",
        database:"fwtdhqnb",
        password:"XjtiKjNatd575aJZGP7C4j0jXE_3TWcg",
        port:5432
    });
};
