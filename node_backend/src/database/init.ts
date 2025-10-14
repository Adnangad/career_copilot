import { env } from "../env";
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(env.DATABASE, env.USERNAME, env.PASSWORD, {
    host: env.HOST,
    dialect: "postgres"
});
