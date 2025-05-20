import { db } from "../database/connection";
import { DataTypes } from "sequelize";

const Question = db.define(
  "Question",
  {
    qId: {
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    qText: {
      type: DataTypes.STRING,
    },
    qTrait: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  },
);

export const questions = await Question.findAll();