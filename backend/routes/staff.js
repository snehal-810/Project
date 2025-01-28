const express = require("express");
const router = express.Router();
const db = require("../db");
const utils = require("../utils");
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");
const config = require("../config");
const authorizeRole = require("../middlewares/AuthorizeRole");

const STAFF_TABLE = config.STAFF_TABLE_NAME;
const COURSE_TABLE = config.COURSE_TABLE_NAME;
const SUBJECT_TABLE = config.SUBJECT_TABLE_NAME;
const SCHEMA_TABLE = config.SCHEME_TABLE_NAME;
const GROUP_TABLE = config.GROUP_TABLE_NAME;
const STUDENT_TABLE = config.STUDENT_TABLE_NAME;
const MARKS_ENTRY_TABLE = config.MARK_ENTER_TABLE_NAME;

// REGISTER API
router.post("/register", (request, response) => {
    const { email, password, employee_number, staff_name } = request.body;
  
    // create a sql statement
    const statement = `INSERT INTO ${STAFF_TABLE} 
      (email, password, employee_number, staff_name)
      VALUES (?, ?, ?, ?)`;
  
    // encrypt the password
    const encryptedPassword = String(crypto.SHA256(password));
  
    db.execute(
      statement,
      [email, encryptedPassword, employee_number, staff_name],
      (error, result) => {
        response.send(utils.createResponse(error, result));
      }
    );
  });


  // LOGIN API
router.post("/login", (request, response) => {
  // Destructuring email and password from the request body
  const { email, password } = request.body;

  const statement = `SELECT staff_id, employee_number, staff_name, email, course_name,role 
      FROM ${STAFF_TABLE} 
      WHERE email = ? AND password = ?`;

  // Encrypting the provided
  const encryptedPassword = String(crypto.SHA256(password));

  // Executing the SQL query with user-provided email and encrypted password
  db.execute(statement, [email, encryptedPassword], (error, users) => {
    if (error) {
      response.send(utils.createErrorResponse(error));
    } else {
      if (users.length == 0) {
        response.send(utils.createErrorResponse("user not found!"));
      } else {
        const staff = users[0];
        console.log("staff ", staff);

        // Creating a payload with user information for JWT token
        const payload = {
          staff_id: staff["staff_id"],
          email: staff["email"],
          employee_number: staff["employee_number"],
          staff_name: staff["staff_name"],
          role: staff["role"],
          course_name: staff["course_name"],
        };
        console.log("staff payload ", payload);

        // Generating a JWT token with the payload and a secret key
        const token = jwt.sign(payload, config.SECRET_KEY);

        response.send(
          utils.createSuccessResponse({
            token,
            // username: user["username"], or
            staff_name: staff.staff_name,
          })
        );
      }
    }
  });
});

  module.exports = router;