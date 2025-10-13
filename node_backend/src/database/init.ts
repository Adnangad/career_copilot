import { env } from "../env";
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(env.DBConnect);
