import dotenv from "dotenv";
dotenv.config();

export const env = {
    DBConnect: process.env.DBURL || "",
    USERNAME: process.env.PGUSER || "",
    DATABASE: process.env.PGDATABASE || "",
    PASSWORD: process.env.PGPASSWORD || "",
    HOST: process.env.PGHOST || "",
}