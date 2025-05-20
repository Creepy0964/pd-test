import { session } from "telegraf";
import { bot } from "..";
import { logger } from "../database/connection";
import { logClearTimeout } from "../utils/logClear";
import { msgComposer } from "./messageHandler";

export function initialize() {
  bot.use(msgComposer);
  logClearTimeout();
  logger.info(`bot started`);
}
