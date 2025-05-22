import { Sequelize } from "sequelize";
import { Logger } from "../utils/logger";

export const logger = new Logger(3);

export const db = new Sequelize({
  dialect: "sqlite",
  storage: "./db/database2.db",
  logging: (msg) => logger.debug(msg),
});
