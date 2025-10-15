import { env } from "../env";
import { Sequelize } from "sequelize";
import { Redis } from "@upstash/redis";

export const sequelize = new Sequelize(env.DATABASE, env.USERNAME, env.PASSWORD, {
    host: env.HOST,
    dialect: "postgres"
});

export const redis = new Redis({
    url: env.REDIS_REST_URL,
    token: env.REDIS_TOKEN
})