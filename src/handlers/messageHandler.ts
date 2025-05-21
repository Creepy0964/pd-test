import { Composer, Scenes, session } from "telegraf";
import { questions } from "../models/questionModel";
import { MyContext } from "../context/context";
import { traits, traitTranslation } from "../models/traitModel";
import { Result } from "../models/resultModel";
import { nanoid } from "nanoid";
import { User } from "../models/userModel";
import { logger } from "../database/connection";
import { entryWizard } from "../wizard/entryWizard";
import { bot } from "..";

export const msgComposer = new Composer<MyContext>();
function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

type Result = {
  trait: string;
  t: number;
};

const stage = new Scenes.Stage<MyContext>([entryWizard]);

msgComposer.use(session());
msgComposer.use(stage.middleware());
msgComposer.use(async (ctx, next) => {
  if (!ctx.session.question)
    Object.assign(ctx.session, {
      question: 0,
      buffer: 0,
      anhedonia: 0,
      anxiousness: 0,
      attentionSeeking: 0,
      callousness: 0,
      deceitfulness: 0,
      depressivity: 0,
      distractibility: 0,
      eccentricity: 0,
      emotionalLability: 0,
      grandiosity: 0,
      hostility: 0,
      impulsivity: 0,
      intimacyAvoidance: 0,
      irresponsibility: 0,
      manipulativeness: 0,
      perceptualDysregulation: 0,
      perseveration: 0,
      restrictedAffectivity: 0,
      rigidPerfectionism: 0,
      riskTaking: 0,
      separationInsecurity: 0,
      submissiveness: 0,
      suspiciousness: 0,
      unusualBeliefsExperiences: 0,
      withdrawal: 0,
    });
  return next();
});

msgComposer.command("zalupkaras", async (ctx) => {
  if (ctx.from.id != 814958085) return;
  const users = await User.findAll();
  const args = ctx.message?.text.split(" ").slice(1);
  const textToSay = args.join(" ");
  for (const x of users) {
    try {
      await bot.telegram.sendMessage(x.toJSON().uTId, textToSay);
    } catch (err) {
      logger.error(err);
    }
  }
});

msgComposer.command("lock", async (ctx) => {
  if (ctx.from.id != 814958085) return;
  await User.update({ uUsername: "testLocked" }, { where: { uTid: 228 } });
  await ctx.reply(`locked`);
});

msgComposer.command("unlock", async (ctx) => {
  if (ctx.from.id != 814958085) return;
  await User.update({ uUsername: "abc" }, { where: { uTid: 228 } });
  await ctx.reply(`unlocked`);
});

msgComposer.command("start", async (ctx) => {
  const user = await User.findOne({ where: { uTId: ctx.from.id } });
  if (!user) {
    User.create({
      uTId: ctx.from.id,
      uUsername: ctx.from.username,
      uResultID: null,
      uState: null,
    });
    logger.info(`user does not exist. creating...`);
    const test = await User.findOne({ where: { uTId: 228 } });
    if (test!.toJSON().uUsername == "testLocked") {
      await ctx.reply(
        `увы, пока тест недоступен, так как мы ждем, чтобы отправиться на техработы. пожалуйста, подожди`,
      );
      return;
    } else {
      logger.info(
        `user ${ctx.from.id} || ${ctx.from.username} started the test`,
      );
      ctx.scene.enter("entry");
      return;
    }
  }
  if (user && user.toJSON().uResultID != null) {
    logger.info(
      `user ${ctx.from.id} || ${ctx.from.username} has already completed the test`,
    );
    await ctx.reply(
      `ты уже проходил(а) тест. посмотреть результаты можно по кнопке ниже`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "результаты", callback_data: "results" }],
            [{ text: "сброс результата", callback_data: "resultReset" }],
          ],
        },
      },
    );
    return;
  }
  logger.info(`user ${ctx.from.id} || ${ctx.from.username} started the test`);
  ctx.scene.enter("entry");
});

msgComposer.command("reset", async (ctx) => {
  const user = await User.findOne({ where: { uTId: ctx.from.id } });
  await Result.destroy({
    where: { rUUID: user!.toJSON().uResultID },
  });
  await user?.destroy();
  logger.info(`user ${ctx.from.id} || ${ctx.from.username} reset the test`);
  await ctx.reply(
    `данные уничтожены. нажмите команду /start, чтобы начать все сначала`,
  );
});

msgComposer.command("info", async (ctx) => {
  await ctx.reply(
    `тест на расстройство личности по DSM-5: форма PID-5\n\nсоздано @creepy0964 за ежегодный бюджет мавритании\n\nпримечание: как тест, так и бот находятся в стадии публичного бета-тестирования, а значит, могут возникать баги и ошибки. если таковые возникли, пожалуйста, пиши в лс`,
  );
});

msgComposer.on("callback_query", async (ctx) => {
  let data = "";
  if ("data" in ctx.callbackQuery) data = ctx.callbackQuery.data;
  const ans = data.split("_");

  if (data.includes("ans0")) {
    ctx.session.question += 1;
    ctx.session[ans[1]] += 0;
    ctx.session.buffer = 0;
  }

  if (data.includes("ans1")) {
    ctx.session.question += 1;
    ctx.session[ans[1]] += 1;
    ctx.session.buffer = 1;
  }

  if (data.includes("ans2")) {
    ctx.session.question += 1;
    ctx.session[ans[1]] += 2;
    ctx.session.buffer = 2;
  }

  if (data.includes("ans3")) {
    ctx.session.question += 1;
    ctx.session[ans[1]] += 3;
    ctx.session.buffer = 3;
  }

  if (data.includes("back")) {
    if (ctx.session.buffer == -1 || ctx.session.question == 0) return;
    ctx.session.question -= 1;
    const { qId, qText, qTrait } = questions[ctx.session.question]?.toJSON();
    ctx.session[qTrait] -= ctx.session.buffer;
    ctx.session.buffer = -1;
  }

  if (data.includes("healthy")) {
    const user = await User.findOne({ where: { uTId: ctx.from.id } });
    await user?.update({ uState: "healthy" });
  }

  if (data.includes("pd")) {
    const user = await User.findOne({ where: { uTId: ctx.from.id } });
    await user?.update({ uState: "pd" });
  }

  if (data.includes("pd_therapy")) {
    const user = await User.findOne({ where: { uTId: ctx.from.id } });
    await user?.update({ uState: "pd_therapy" });
  }

  if (data.includes("debug")) {
    for (const x of traits) {
      const { tName, tQuestions } = x?.toJSON();
      ctx.session[tName] = getRandomInt(tQuestions * 3 + 1);
    }
    ctx.session.question = 220;
  }

  if (data.includes("results")) {
    logger.info(
      `user ${ctx.from.id} || ${ctx.from.username} retrieved the results`,
    );
    const user = await User.findOne({ where: { uTId: ctx.from.id } });
    const results = await Result.findAll({
      where: { rUUID: user!.toJSON().uResultID },
    });
    const resultMapped = results.map((n) => n.toJSON());
    await ctx.reply(
      `${resultMapped.map((n) => `${traitTranslation[n.rTrait]}: T = ${parseFloat(n.rT.toFixed(2))}`).join("\n\n")}`,
    );
    return;
  }

  if (data.includes("resultReset")) {
    logger.info(
      `user ${ctx.from.id} || ${ctx.from.username} deleted their result`,
    );
    const user = await User.findOne({ where: { uTId: ctx.from.id } });
    await Result.destroy({
      where: { rUUID: user!.toJSON().uResultID },
    });
    await user!.update({ uResultID: null });
    ctx.editMessageText(
      `результат удален. нажми команду /start, чтобы пройти тест заново`,
    );
    return;
  }

  if (ctx.session.question <= 219) {
    const { qId, qText, qTrait } = questions[ctx.session.question]?.toJSON();
    try {
      ctx.editMessageText(`Вопрос №${qId}\n\n${qText}\n\ndebug: ${qTrait}`, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "0", callback_data: `ans0_${qTrait}` },
              { text: "1", callback_data: `ans1_${qTrait}` },
            ],
            [
              { text: "2", callback_data: `ans2_${qTrait}` },
              { text: "3", callback_data: `ans3_${qTrait}` },
            ],
            [
              { text: "назад", callback_data: `back` },
              { text: "debug", callback_data: `debug` },
            ],
          ],
        },
      });
    } catch (err) {
      logger.error(err);
    }
  } else {
    logger.info(
      `user ${ctx.from.id} || ${ctx.from.username} completed the test`,
    );
    const result: Result[] = [];
    const resultId = nanoid(10);
    for (const x of traits) {
      const { tName, tQuestions, tMean, tSD } = x?.toJSON();
      if (tName in ctx.session) {
        const rawPure: number = ctx.session[tName] / tQuestions;
        const z: number = (rawPure - tMean) / tSD;
        const t: number = 50 + z * 10;
        result.push({
          trait: traitTranslation[tName],
          t: parseFloat(t.toFixed(2)),
        });
        await Result.create({
          rUUID: resultId,
          rRawPure: rawPure,
          rRaw: rawPure,
          rZ: z,
          rT: z,
          rTrait: tName,
        });
        await User.update(
          { uResultID: resultId },
          { where: { uTID: ctx.from.id } },
        );
      }
    }
    await ctx.reply(
      `${result.map((n) => `${n.trait}: T = ${n.t}`).join("\n\n")}`,
    );
    await ctx.reply(
      `спасибо за участие в бета\\-тесте\\! интерпретацию результатов можно изучить здесь\\: [тык](https://teletype.in/@creepy0964/pd-test-interpretation)`,
      {
        parse_mode: "MarkdownV2",
      },
    );
  }
});
