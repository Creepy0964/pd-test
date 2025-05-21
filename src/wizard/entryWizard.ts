import { MyContext } from "../context/context.ts";
import { logger } from "../database/connection.ts";
import { bot } from "../index.ts";
import { Composer, Context, Scenes } from "telegraf";

const test = new Composer<MyContext>();

export const entryWizard = new Scenes.WizardScene<MyContext>(
  "entry",
  async (ctx) => {
    await ctx.sendMessage(
      `привет\\! это тест на РЛ по DSM\\-5\\. прочитай [дисклеймер](https://teletype.in/@creepy0964/pd-test-disclaimer)`,
      {
        reply_markup: {
          inline_keyboard: [[{ text: "прочитал(а)", callback_data: "zalupa" }]],
        },
        parse_mode: "MarkdownV2",
      },
    );
  },
  async (ctx) => {
    await ctx.editMessageText(
      `инструкция к тесту. ОБЯЗАТЕЛЬНО К ПРОЧТЕНИЮ\n1. в вопросах приводятся различные черты, с которыми ты можешь или не можешь себя проассоциировать. здесь нет правильных или неправильных ответов — пожалуйста, отвечай на вопросы честно\n2. в ответах 0 — "черта очень редко или совсем не подходит", 3 — "черта очень часто или постоянно меня описывает"\n3. отвечая на вопросы, помни, что каждая из черт должна тебя описывать или не описывать в целом, а не в конкретно взятый момент. проще говоря, это должно в тебе быть/не быть большую часть твоей жизни, а не в условные последние полгода\n4. при прохождении теста ЖЕЛАТЕЛЬНО, если ты будешь нажимать на кнопки не чаще, чем раз в 2 секунды. телеграм не позволяет юзерам использовать инлайн-кнопки слишком часто и из-за этого, если прожимать слишком часто, бот может "подвисать" в процессе`,
      {
        reply_markup: {
          inline_keyboard: [[{ text: "принято", callback_data: "zalupa" }]],
        },
      },
    );
  },
  async (ctx) => {
    await ctx.editMessageText(
      `прежде чем приступить к тесту, учти: нажимая на кнопку ниже, ты даешь свое согласие на сбор анонимной статистики и последующую ее использование для публикаций в новостном канале бота\n\nсобираются только анонимные ID результатов, состояние ментального здоровья, сырые баллы и подсчитанный окончательный результат`,
      {
        reply_markup: {
          inline_keyboard: [[{ text: "подтверждаю", callback_data: "zalupa" }]],
        },
      },
    );
  },
  async (ctx) => {
    return ctx.scene.leave();
  },
);

entryWizard.action("zalupa", async (ctx) => {
  ctx.wizard.next();
  return ctx.wizard.steps[ctx.wizard.cursor](ctx);
});

entryWizard.leave(async (ctx) => {
  await ctx.reply(`выбери свое состояние здоровья`, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "здоров(а)/не имею РЛ", callback_data: "healthy" },
          { text: "имею РЛ, не в терапии", callback_data: "pd" },
        ],
        [{ text: "имею РЛ, в терапии", callback_data: "pd_therapy" }],
      ],
    },
  });
});
