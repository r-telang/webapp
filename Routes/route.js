import express from "express";
import basicAuth from "../Authentication/basicAuth.js";
import * as assignmentController from "../controller/assignmentController.js";
import logger from "../logger.js";
// const assignmentController = require('../controller/assignmentController.js');

const router = express.Router();

// router
//   .route("/assignments")
//   .get(basicAuth, assignmentController.getAllAssignments);
// router
//   .route("/assignments")
//   .post(basicAuth, assignmentController.createAssignment);
// router
//   .route("/assignments/:id")
//   .get(basicAuth, assignmentController.getAssignmentById);
// router
//   .route("/assignments/:id")
//   .delete(basicAuth, assignmentController.deleteAssignment);
// router
//   .route("/assignments/:id")
//   .put(basicAuth, assignmentController.updateAssignmentById);
// // logger.info(`Fetching assignment by ID: ${req.query.id}`);
// // logger.info("Fetching all assignments");

// Add logger to log information related to specific route handlers
router.route("/assignments").get(basicAuth, (req, res) => {
  logger.info("Fetching all assignments.");
  assignmentController.getAllAssignments(req, res);
});

router.route("/assignments").post(basicAuth, (req, res) => {
  logger.info("Creating a new assignment.");
  assignmentController.createAssignment(req, res);
});

router.route("/assignments/:id").get(basicAuth, (req, res) => {
  logger.info(`Fetching assignment by ID: ${req.params.id}`);
  assignmentController.getAssignmentById(req, res);
});

router.route("/assignments/:id").delete(basicAuth, (req, res) => {
  logger.info(`Deleting assignment by ID: ${req.params.id}`);
  assignmentController.deleteAssignment(req, res);
});

router.route("/assignments/:id").put(basicAuth, (req, res) => {
  logger.info(`Updating assignment by ID: ${req.params.id}`);
  assignmentController.updateAssignmentById(req, res);
});
router.use((req, res) => {
  res.status(405).send();
});

export default router;
