import { promises as fspromises } from "fs";
import path from "path";

// const csvParser = require('papaparse');
import User from "../model/UserModel";
import sequelize from "../config/database";
// import User from  sequelize.models.User;
const bcrypt = require("bcrypt");

// console.log("Hello");
// console.log(User1);

const UserVerify = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  console.log(req.body);
  // const { email, password } = req.body;

  try {
    // Check if the user exists in the database
    console.log("Entry user check");
    const existingUser = await User.findOne({ where: { email } });
    console.log(existingUser);

    if (existingUser) {
      // return res.status(404).json({ message: 'User not found' });
      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (isPasswordValid) {
        // Password is valid, return success response
        return res.status(200).json({ message: "User verified successfully" });
      } else {
        // Password is invalid, return unauthorized response
        return res.status(401).json({ message: "Incorrect password" });
      }
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = UserVerify;
