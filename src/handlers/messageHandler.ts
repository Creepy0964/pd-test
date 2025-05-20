import { Composer, session } from "telegraf";
import { db } from "../database/connection";
import { questions } from "../models/questionModel";
import { MyContext } from "../context/context";
import { traits, traitTranslation } from "../models/traitModel";
import { Beta } from "../models/betaModel";
import { Result } from "../models/resultModel";
import { nanoid } from "nanoid";
import { User } from "../models/userModel";

export const msgComposer = new Composer<MyContext>();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

type Result = {
  trait: string;
  rawPure: number;
  raw: number;
  z: number;
  t: number;
};

msgComposer.use(session());
msgComposer.use(async (ctx, next) => {
  if (!ctx.session) {
    ctx.session = {
      question: 0,
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
    };
  }
  return next();
});

msgComposer.command("start", async (ctx) => {
  const user = await User.findOne({ where: { uTId: ctx.from.id } });
  if (!user)
    User.create({
      uTId: ctx.from.id,
      uUsername: ctx.from.username,
      uResultID: null,
    });
  if (user && user.toJSON().uResultID != null) {
    await ctx.reply(
      `ты уже проходил(а) тест. посмотреть результаты можно по кнопке ниже`,
      {
        reply_markup: {
          inline_keyboard: [[{ text: "результаты", callback_data: "results" }]],
        },
      },
    );
    return;
  }
  if (!Beta.findByPk(ctx.from.id)) return;
  await ctx.reply(`ВНИМАНИЕ: тест может давать сбой. будь к этому готов(а)`);
  const { qId, qText, qTrait } = questions[0]?.toJSON();
  await ctx.reply(`Вопрос №${qId}\n\n${qText}\n\ndebug: ${qTrait}`, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "0", callback_data: `ans0_${qTrait}` },
          { text: "1", callback_data: `ans1_${qTrait}` },
        ],
        [
          { text: "2", callback_data: `ans2_${qTrait}` },
          { text: "3", callback_data: `ans3_${qTrait}` },
          // { text: "debug", callback_data: `debug` },
        ],
      ],
    },
  });
});

msgComposer.on("callback_query", async (ctx) => {
  const data = ctx.callbackQuery.data;
  const ans = data.split("_");

  if (data.includes("ans0")) {
    ctx.session.question += 1;
    ctx.session[ans[1]] += 0;
  }

  if (data.includes("ans1")) {
    ctx.session.question += 1;
    ctx.session[ans[1]] += 1;
  }

  if (data.includes("ans2")) {
    ctx.session.question += 1;
    ctx.session[ans[1]] += 2;
  }

  if (data.includes("ans3")) {
    ctx.session.question += 1;
    ctx.session[ans[1]] += 3;
  }

  if (data.includes("debug")) {
    for (const x of traits) {
      const { tId, tName, tQuestions, tMean, tSD } = x?.toJSON();
      ctx.session[tName] = getRandomInt(tQuestions * 3 + 1);
    }
    ctx.session.question = 220;
  }

  if (data.includes("results")) {
    const user = await User.findOne({ where: { uTId: ctx.from.id } });
    const results = await Result.findAll({
      where: { rUUID: user!.toJSON().uResultID },
    });
    const resultMapped = results.map((n) => n.toJSON());
    await ctx.reply(
      `${resultMapped.map((n) => `${traitTranslation[n.rTrait]}: T = ${n.rT}`).join("\n\n")}`,
    );
    return;
  }

  if (ctx.session.question <= 219) {
    const { qId, qText, qTrait } = questions[ctx.session.question]?.toJSON();
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
        ],
      },
    });
  } else {
    const result: Result[] = [];
    const resultId = nanoid(10);
    for (const x of traits) {
      const { tId, tName, tQuestions, tMean, tSD } = x?.toJSON();
      if (tName in ctx.session) {
        const rawPure: number = ctx.session[tName] / tQuestions;
        const raw: number = Math.round(ctx.session[tName] / tQuestions);
        const z: number = (raw - tMean) / tSD;
        const t: number = 50 + z * 10;
        result.push({
          trait: traitTranslation[tName],
          rawPure: rawPure,
          raw: raw,
          z: z,
          t: parseFloat(t.toFixed(2)),
        });
        Result.create({
          rUUID: resultId,
          rRawPure: rawPure,
          rRaw: raw,
          rZ: z,
          rT: parseFloat(t.toFixed(2)),
          rTrait: tName,
        });
        User.update({ uResultID: resultId }, { where: { uTID: ctx.from.id } });
      }
    }
    await ctx.reply(
      `${result.map((n) => `${n.trait}: T = ${n.t}`).join("\n\n")}`,
    );
    await ctx.reply(`числа выше отправить @creepy0964`);
  }
});
