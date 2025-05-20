import { db } from "../database/connection";
import { DataTypes } from "sequelize";

const Trait = db.define(
  "Trait",
  {
    tId: {
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    tName: {
      type: DataTypes.STRING,
    },
    tQuestions: {
      type: DataTypes.INTEGER,
    },
    tMean: {
      type: DataTypes.NUMBER,
    },
    tSD: {
      type: DataTypes.NUMBER,
    },
  },
  {
    timestamps: false,
  },
);

export const traits = await Trait.findAll();

export const traitTranslation = {
  anhedonia: "ангедония",
  anxiousness: "тревожность",
  attentionSeeking: "поиск внимания",
  callousness: "бессердечность",
  deceitfulness: "лживость",
  depressivity: "депрессивность",
  distractibility: "отвлекаемость",
  eccentricity: "эксцентричность",
  emotionalLability: "эмоциональная нестабильность",
  grandiosity: "грандиозность",
  hostility: "враждебность",
  impulsivity: "импульсивность",
  intimacyAvoidance: "избегание близости",
  irresponsibility: "безответственность",
  manipulativeness: "манипулятивность",
  perceptualDysregulation: "искажение восприятия",
  perseveration: "упрямство",
  restrictedAffectivity: "сдержанность аффекта",
  rigidPerfectionism: "ригидный перфекционизм",
  riskTaking: "рискованность",
  separationInsecurity: "страх оставления",
  submissiveness: "покорность",
  suspiciousness: "подозрительность",
  unusualBeliefsExperiences: "необычные убеждения и опыт",
  withdrawal: "отчужденность",
};
