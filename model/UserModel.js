import { DATE, DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import bcrypt from "bcrypt";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        const hashedPassword = bcrypt.hashSync(value, 10); // hashing the password
        // console.log(hashedPassword)
        this.setDataValue("password", hashedPassword);
      },
    },
    account_created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    account_updated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    initialAutoIncrement: 1,
  }
);

User.associate = (models) => {
  User.hasMany(models.Assignment, { foreignKey: "user_id", as: "assignments" });
};
// user.associate = function(models) {
//     user.hasOne(models.role, {foreignKey: 'id',sourceKey: 'roleId'});

// }
export default User;
