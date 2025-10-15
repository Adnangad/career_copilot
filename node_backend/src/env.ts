import dotenv from "dotenv";
dotenv.config();

export const env = {
    DBConnect: process.env.DBURL || "",
    USERNAME: process.env.PGUSER || "",
    DATABASE: process.env.PGDATABASE || "",
    PASSWORD: process.env.PGPASSWORD || "",
    HOST: process.env.PGHOST || "",
    REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL || "",
    REDIS_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN || ""
}