import { db } from "../database/connection";
import { DataTypes } from "sequelize";

export const Beta = db.define(
  "Beta",
  {
    tgId: {
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: false,
  },
);
