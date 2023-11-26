import { DataTypes, INTEGER } from "sequelize";
import sequelize from "../config/database.js";
//import { v4 as uuidv4 } from "uuid";
import Assignment from "./AssignmentModel.js";
import User from "./UserModel.js";
import { logger, logger_err } from "../logger.js";

const Submission = sequelize.define(
  "Submission",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      readOnly: true,
      defaultValue: DataTypes.UUIDV4,
    },
    assignment_id: {
      type: DataTypes.UUID,
      allowNull: false,
      readOnly: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      readOnly: true,
    },
    submission_url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
      readOnly: true,
    },
    submission_date: {
      type: DataTypes.DATE,
      allowNull: false,
      readOnly: true,
      defaultValue: DataTypes.NOW,
    },
    assignment_updated: {
      type: DataTypes.DATE,
      allowNull: false,
      readOnly: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  }
);
Submission.associate = (models) => {
  Submission.belongsTo(models.Assignment, {
    foreignKey: "assignment_id",
    as: "assignment",
  });
  Submission.belongsTo(models.User, {
    foreignKey: "user_id",
    as: "user",
  });
};

Submission.beforeCreate(async (submission, options) => {
  try {
    // Fetch the associated assignment
    const assignment = await Assignment.findByPk(submission.assignment_id);

    // Fetch the associated user
    const user = await User.findByPk(submission.user_id);

    // Check if the deadline has passed
    if (new Date() > assignment.deadline) {
      logger_err.error("Submission rejected. Deadline has passed.");
      throw new Error("Submission rejected. Deadline has passed.");
    }

    // Check the number of attempts
    const numAttempts = await Submission.count({
      where: {
        assignment_id: submission.assignment_id,
        user_id: submission.user_id,
      },
    });

    if (numAttempts >= assignment.num_of_attempts) {
      logger_err.error(
        "submission rejected. Exceeded maximum number of attempts."
      );
      throw new Error(
        "Submission rejected. Exceeded maximum number of attempts."
      );
    }

    // Update the assignment_updated field in the Assignment model
    assignment.assignment_updated = new Date();
    await assignment.save();

    // Update the submission_date field in the Submission model
    submission.submission_date = new Date();
  } catch (error) {
    throw new Error(error.message);
  }
});

export default Submission;
