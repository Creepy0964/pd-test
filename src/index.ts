import { Telegraf } from "telegraf";
import { MyContext } from "./context/context";
import { initialize } from "./handlers/init";
import { logger } from "./database/connection";

export const bot = new Telegraf<MyContext>(
  "5118259434:AAHZcwNbU_IlbVJmUtu8V-jm2Rp6wxrZ63k",
);

bot.launch(() => {
  initialize();
});

bot.catch(async (err) => {
  console.log(err);
});

process.once("SIGINT", () => {
  logger.info("Bot stopped");
  bot.stop();
});

process.once("SIGTERM", () => {
  logger.info("Bot stopped");
  bot.stop();
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception thrown: ${err}`);
});
