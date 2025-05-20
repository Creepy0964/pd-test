import { Telegraf } from "telegraf";
import { MyContext } from "./context/context";
import { Logger } from "./utils/logger";
import { msgComposer } from "./handlers/messageHandler";

export const bot = new Telegraf<MyContext>("");
export const logger = new Logger(3);

bot.use(msgComposer);
bot.launch();

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
