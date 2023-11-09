import Assignment from "../model/AssignmentModel.js";
import sequelize from "../config/database.js";
import User from "../model/UserModel.js";
//import SDC from "statsd-client";
//const statsd = require("statsd-client");
import { StatsD } from "node-statsd";
//sdc = new SDC({ host: "statsd.example.com" });
import { logger, logger_err } from "../logger.js";
import { JSON, json } from "sequelize";
export const client = new StatsD({ host: "localhost", port: 8125 });

export const createAssignment = async (req, res) => {
  client.increment("api.hits.createAssignment");
  try {
    const { name, points, num_of_attempts, deadline } = req.body;
    const user_id = req.user.id;
    // console.log(req.body)

    // 400 Bad Request for invalid input
    if (!name || !points || !num_of_attempts || !deadline) {
      return res
        .status(400)
        .json({ message: "Invalid input: All fields are required" });
    }
    // 401 Unauthorized if user id is not present
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newAssignment = await Assignment.create({
      user_id,
      name,
      points,
      num_of_attempts,
      deadline,
    });
    const createdAssignment = await Assignment.findByPk(newAssignment.id, {
      attributes: {
        exclude: ["user_id"],
      },
    });
    logger.info("a new assignment was created.");
    res.status(201).json(createdAssignment);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      logger.error("assignment already exists", error);
      return res
        .status(400)
        .json({ error: "Assignment with the same name already exists." });
    }
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json("Bad Request");
    }
    logger_err.error(
      "a new assignment was not created." + JSON.toString(error)
    );
    return res.status(500).json(error.name);
  }
};

//get all ASsignments

export const getAllAssignments = async (req, res) => {
  client.increment("api.hits.getAllAssignments");
  try {
    console.log("get alla mdasmc");
    const user_id = req.user.id;

    const assignments = await Assignment.findAll(
      // user_id,
      {
        // include: [
        //   {
        //     model: User,
        //     as: "user",
        //     attributes: ["id", "first_name", "last_name", "email"],
        //   },
        // ],
        attributes: {
          exclude: ["user_id"], // Exclude the  column
        },
      }
    );

    if (!assignments || assignments.length === 0) {
      return res.status(404).json({ message: "No assignments found" });
    }
    logger.info("assignments found successfully");
    res.status(200).json(assignments);
  } catch (error) {
    logger_err.error("unable to fetch assignments.");
    return res.status(401).json(error.message);
  }
};

// Update assignment

export const updateAssignmentById = async (req, res) => {
  client.increment("api.hits.updateAssignmentById");
  try {
    const { id } = req.params;
    const { name, points, num_of_attempts, deadline } = req.body;
    console.log(deadline);

    const authenticatedUserId = req.user.id;

    // Finding the assignment to update
    const assignment = await Assignment.findOne({
      where: { id },
      attributes: {
        //exclude: ["user_id"], // Exclude the  column
      },
    });
    //const assignment1 = assignment.toJSON();
    //console.log(JSON.parse(assignment1));
    if (!assignment) {
      logger.info("Assignment not found");
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (assignment.user_id !== authenticatedUserId) {
      logger.warn(
        "Not allowed to update the assignment (Authorization Failed)"
      );
      return res
        .status(403)
        .json({ message: "You are not allowed to update this assignment" });
    }

    //delete assignment.user_id;

    if (!name && !points && !num_of_attempts && !deadline) {
      return res
        .status(400)
        .json({ message: "No fields to update were provided" });
    }

    let updatedFields = [];

    // Updating assignment
    if (name && assignment.name !== name) {
      assignment.name = name;
      updatedFields.push("name");
    }
    if (points && assignment.points !== points) {
      assignment.points = points;
      updatedFields.push("points");
    }
    if (num_of_attempts && assignment.num_of_attempts !== num_of_attempts) {
      assignment.num_of_attempts = num_of_attempts;
      updatedFields.push("num_of_attempts");
    }
    if (deadline && assignment.deadline !== deadline) {
      assignment.deadline = deadline;
      updatedFields.push("deadline");
    }

    // If there are no changes
    if (updatedFields.length === 0) {
      logger.info("Assignment is not updated, No changes in the input. ");
      return res
        .status(304)
        .json("No update is required. No changes in the input.");
    }

    await assignment.save();

    // Sending the updated assignment in the response
    logger.info("assignment updated successfully");
    return res.status(204).json(assignment);
  } catch (error) {
    logger_err.error("unable to update assignment", error);
    return res.status(500).json(error.message);
  }
};

// delete assign

export const deleteAssignment = async (req, res) => {
  client.increment("api.hits.deleteAssignment");
  try {
    // Retrieve ID from the request parameters
    const { id } = req.params;
    const authenticatedUserId = req.user.id;

    const assignment = await Assignment.findOne({ where: { id } });

    if (!assignment) {
      return res.status(404).json({ message: "assignment not found" });
    }

    if (assignment && assignment.user_id !== authenticatedUserId) {
      logger.error(
        "Not allowed to delete the assignment (Authorization Failed)"
      );
      return res
        .status(401)
        .json("You are not allowed to delete this assignment");
    }

    // Attempt to delete the assignment with the given ID
    const deletedRowCount = await Assignment.destroy({
      where: { id: id },
    });
    logger.info("Assignment deleted successfully");
    res.status(204).json({ message: "Assignment deleted successfully" });
  } catch (error) {
    logger_err.error("unable to delete assignments");
    return res.status(500).json(error.message);
  }
};

//get assign by id

export const getAssignmentById = async (req, res) => {
  client.increment("api.hits.getAssignmentById");
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    console.log(id);

    const assg = await Assignment.findOne({
      where: { id: id },
      attributes: {
        exclude: ["user_id"], // Exclude the  column
      },
    });
    // Check if assignment exists
    if (!assg) {
      logger.info("Assignment not found", id);
      return res.status(404).json({ message: "Assignment not found" });
    }
    logger.info("Assignment found");
    res.status(200).json(assg);
  } catch (error) {
    logger_err.error("server error", error.message);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
