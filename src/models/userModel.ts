import { db } from "../database/connection";
import { DataTypes } from "sequelize";

export const User = db.define(
  "User",
  {
    uId: {
      primaryKey: true,
      field: "uId",
      type: DataTypes.INTEGER,
    },
    uTId: {
      type: DataTypes.INTEGER,
      field: "uTId",
    },
    uUsername: {
      type: DataTypes.STRING,
    },
    uResultID: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  },
);
