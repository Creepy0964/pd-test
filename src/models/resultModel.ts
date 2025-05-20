import { db } from "../database/connection";
import { DataTypes } from "sequelize";

export const Result = db.define(
  "Result",
  {
    rId: {
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    rUUID: {
      type: DataTypes.STRING,
    },
    rRawPure: {
      type: DataTypes.NUMBER,
    },
    rRaw: {
      type: DataTypes.INTEGER,
    },
    rZ: {
      type: DataTypes.NUMBER,
    },
    rT: {
      type: DataTypes.NUMBER,
    },
    rTrait: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  },
);
