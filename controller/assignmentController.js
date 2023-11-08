import Assignment from "../model/AssignmentModel.js";
import sequelize from "../config/database.js";
import User from "../model/UserModel.js";
//import SDC from "statsd-client";
//const statsd = require("statsd-client");
//import {  } from "statsd-client";
//sdc = new SDC({ host: "statsd.example.com" });
import logger from "../logger.js";
//const client = new statsd();
//var timer = new Date();
//sdc.increment("some.counter");

export const createAssignment = async (req, res) => {
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

    res.status(201).json(createdAssignment);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({ error: "Assignment with the same name already exists." });
    }
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json("Bad Request");
    }
    logger.error("a new assignment was not created.");
    return res.status(500).json(error.name);
  }
};

//get all ASsignments

export const getAllAssignments = async (req, res) => {
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

    res.status(200).json(assignments);
  } catch (error) {
    logger.error("unable to fetch assignments.");
    return res.status(401).json(error.message);
  }
  //client.increment("api.hits.getAllAssignments");
};

// Update assignment

export const updateAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, points, num_of_attempts, deadline } = req.body;
    console.log(deadline);

    const authenticatedUserId = req.user.id;

    // Finding the assignment to update
    const assignment = await Assignment.findOne({
      where: { id },
      attributes: {
        exclude: ["user_id"], // Exclude the  column
      },
    });

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (assignment.user_id !== authenticatedUserId) {
      return res
        .status(403)
        .json({ message: "You are not allowed to update this assignment" });
    }

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
      return res
        .status(204)
        .json("No update is required. No changes in the input.", assignment);
    }

    await assignment.save();

    // Sending the updated assignment in the response
    res.status(200).json({
      message: "Assignment updated successfully",
      updatedFields,
      assignment,
    });
  } catch (error) {
    logger.error("unable to update assignment");
    return res.status(500).json(error.message);
  }
  //client.increment("api.hits.updateAssignmentById");
};

// delete assign

export const deleteAssignment = async (req, res) => {
  try {
    // Retrieve ID from the request parameters
    const { id } = req.params;
    const authenticatedUserId = req.user.id;

    const assignment = await Assignment.findOne({ where: { id } });

    if (!assignment) {
      return res.status(404).json({ message: "assignment not found" });
    }

    if (assignment && assignment.user_id !== authenticatedUserId) {
      return res
        .status(401)
        .json("You are not allowed to delete this assignment");
    }

    // Attempt to delete the assignment with the given ID
    const deletedRowCount = await Assignment.destroy({
      where: { id: id },
    });

    res.status(204).json({ message: "Assignment deleted successfully" });
  } catch (error) {
    logger.error("unable to delete assignments");
    return res.status(500).json(error.message);
  }
  //client.increment("api.hits.deleteAssignment");
};

//get assign by id

export const getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    console.log(id);

    const assg = await Assignment.findOne({
      where: { id },
      attributes: {
        exclude: ["user_id"], // Exclude the  column
      },
    });

    console.log(assg);

    // Check if assignment exists
    if (!assg) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json(assg);
  } catch (error) {
    logger.error("unable to fetch assignment by id");
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
  //client.increment("api.hits.getAssignmentById");
};
