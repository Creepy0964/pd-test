import { Telegraf } from "telegraf";
import { MyContext } from "./context/context";
import { initialize } from "./handlers/init";
import { logger } from "./database/connection";

export const bot = new Telegraf<MyContext>("");

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
