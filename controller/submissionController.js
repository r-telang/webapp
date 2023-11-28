import express from "express";
// import Submission from "../models/submissionModel.js";
import Submission from "../model/SubmissionModel.js";
//import { Assignment } from "../models/AssignmentModel.js";
import Assignment from "../model/AssignmentModel.js";
import { logger, logger_err } from "../logger.js";
import client from "../utils/Statsd.js";
import AWS from "aws-sdk";


const sns = new AWS.SNS();

export const createSubmission = async (req, res) => {
  client.increment("api.hits.createSubmission");
  try {
    const assignmentId = req.params.id;
    const userId = req.user.id;
    const { submission_url } = req.body;

    // You may want to perform additional validation on the input data

    // Check if the assignment exists
    const assignment = await Assignment.findByPk(assignmentId);

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    // Check if the assignment is still open for submissions
    if (new Date() > assignment.deadline) {
      return res
        .status(400)
        .json({ error: "Submission rejected. Deadline has passed." });
    }

    // Check the number of attempts
    const numAttempts = await Submission.count({
      where: {
        assignment_id: assignmentId,
        user_id: userId,
      },
    });

    if (numAttempts >= assignment.num_of_attempts) {
      return res.status(400).json({
        error: "Submission rejected. Exceeded maximum number of attempts.",
      });
    }

    // Create a new submission
    const submission = await Submission.create({
      assignment_id: assignmentId,
      user_id: userId,
      submission_url,
    });

    // Post the URL to an SNS topic along with user info
    await postToSNSTopic(submission.submission_url, req.user.email);


    const createdSubmission = await Submission.findByPk(submission.id, {
      attributes: {
        exclude: ["user_id"],
      },
    });

    // Respond with the created submission
    res.status(201).json(createdSubmission);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//export default createSubmission;


// Function to post to SNS topic
const postToSNSTopic = async (submissionUrl, userEmail) => {
  try {
    // Create a message with the submission URL and user email
    const message = `Submission URL: ${submissionUrl}\nUser Email: ${userEmail}`;

    // Specify your SNS topic ARN
    const topicArn = process.env.SNS_TOPIC_ARN;

    // Publish the message to the SNS topic
    await sns
      .publish({
        TopicArn: topicArn,
        Message: message,
        Subject: "New Submission",
      })
      .promise();
  } catch (error) {
    console.error("Error posting to SNS topic:", error);
    throw error;
  }
};

