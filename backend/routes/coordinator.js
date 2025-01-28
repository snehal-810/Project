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

// LOGIN API
router.post("/login", (request, response) => {
    // Destructuring email and password from the request body
    const { email, password } = request.body;
  
    const statement = `SELECT staff_id, employee_number, staff_name, email, role 
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
  
          // Creating a payload with user information for JWT token
          const payload = {
            staff_id: staff["staff_id"],
            email: staff["email"],
            employee_number: staff["employee_number"],
            staff_name: staff["staff_name"],
            staff_role: staff["role"],
          };
  
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

  // ADDING SUBJECTS TO A COURSE
router.post("/subject", authorizeRole(["coordinator"]), (request, response) => {
    const { subject_name, course_id } = request.body;
  
    const statement = `INSERT INTO ${SUBJECT_TABLE} 
          (subject_name, course_id)
          VALUES  (?, ?)`;
  
    db.execute(statement, [subject_name, course_id], (error, result) => {
      response.send(utils.createResponse(error, result));
    });
  });

  // ADDING EVALUATION SCHEMES TO A SUBJECT

router.post(
    "/add-schema",
    authorizeRole(["coordinator"]),
    (request, response) => {
      const {
        theory_weightage,
        lab_weightage,
        ia1_weightage,
        ia2_weightage,
  
        subject_id,
      } = request.body;
  
      const statement = `INSERT INTO ${SCHEMA_TABLE}
          (theory_weightage, lab_weightage, ia1_weightage, ia2_weightage,  subject_id)
          VALUES ( ?, ?, ?, ?, ?)`;
  
      db.execute(
        statement,
        [
          theory_weightage,
          lab_weightage,
          ia1_weightage,
          ia2_weightage,
  
          subject_id,
        ],
        (error, result) => {
          response.send(utils.createResponse(error, result));
        }
      );
    }
  );
  
  //!TEST: ADD MARKING SCHEMA
//? Using this instead of original
router.post(
    "/add-marking-schema",
    authorizeRole(["coordinator"]),
    (request, response) => {
      const {
        theory_weightage,
        lab_weightage,
        ia1_weightage,
        ia2_weightage,
        subject_name,
        course_name,
      } = request.body;
  
      console.log(request.body);
  
      // Step 1: Get course_id from the course table
      const getCourseIdQuery = `SELECT course_id FROM ${COURSE_TABLE} WHERE course_name = ?`;
      console.log("getCourseIdQuery ", getCourseIdQuery);
  
      db.execute(getCourseIdQuery, [course_name], (error, courseResult) => {
        if (error) {
          console.log("error courseId ", error);
  
          response.send(utils.createResponse(error, null));
        } else {
          const course_id = courseResult[0].course_id;
          console.log("course_id", course_id);
  
          // Step 2: Get subject_id from the subject table using course_id and subject_name
          const getSubjectIdQuery = `SELECT subject_id FROM ${SUBJECT_TABLE} WHERE subject_name = ? AND course_id = ?`;
          console.log("getSubjectIdQuery ", getSubjectIdQuery);
  
          db.execute(
            getSubjectIdQuery,
            [subject_name, course_id],
            (error, subjectResult) => {
              if (error) {
                response.send(utils.createResponse(error, null));
              } else {
                const subject_id = subjectResult[0].subject_id;
                console.log("subject_id ", subject_id);
  
                // Step 3: Insert data into the schema table
                const insertStatement = `INSERT INTO ${SCHEMA_TABLE}
                (theory_weightage, lab_weightage, ia1_weightage, ia2_weightage, subject_id)
                VALUES (?, ?, ?, ?, ?)`;
  
                db.execute(
                  insertStatement,
                  [
                    theory_weightage,
                    lab_weightage,
                    ia1_weightage,
                    ia2_weightage,
                    subject_id,
                  ],
                  (error, result) => {
                    response.send(utils.createResponse(error, result));
                  }
                );
              }
            }
          );
        }
      });
    }
  );

  // SHOW ALL THE EVALUATION SCHEME
router.get(
    "/show-schema",
    authorizeRole(["coordinator", "staff"]),
    (request, response) => {
      // Extract the course_name from the query parameters
      const { course_name } = request.query;
  
      // Construct the SQL query with a WHERE clause to filter by course_name
      const query = `
        SELECT Courses.course_name, 
               Subjects.subject_name, 
               Subjects.subject_id,
               EvaluationScheme.*
        FROM Courses
        JOIN Subjects ON Courses.course_id = Subjects.course_id
        JOIN EvaluationScheme ON Subjects.subject_id = EvaluationScheme.subject_id
        WHERE Courses.course_name = ?;`;
  
      // Execute the query with the course_name as a parameter
      db.execute(query, [course_name], (error, results) => {
        if (error) {
          response.send(utils.createErrorResponse(error));
        } else {
          response.send(utils.createSuccessResponse(results));
        }
      });
    }
  );

  // ADDING GROUP
router.post(
  "/add-group",
  authorizeRole(["coordinator"]),
  (request, response) => {
    const { course_id, group_name } = request.body;

    const statement = `INSERT INTO ${GROUP_TABLE} 
        (course_id, group_name)
        VALUES (?, ?)`;

    db.execute(statement, [course_id, group_name], (error, result) => {
      if (error) {
        response.send(utils.createErrorResponse(error));
      } else {
        response.send(utils.createSuccessResponse("Group added successfully!"));
      }
    });
  }
);

// SHOW GROUPS
router.get(
    "/show-groups",
    authorizeRole(["coordinator"]),
    (request, response) => {
      const query = `
          SELECT ${COURSE_TABLE}.course_name, ${GROUP_TABLE}.group_name
          FROM ${COURSE_TABLE} 
          JOIN ${GROUP_TABLE}  
          ON ${COURSE_TABLE}.course_id = ${GROUP_TABLE}.course_id;
        `;
  
      db.execute(query, (error, results) => {
        if (error) {
          response.send(utils.createErrorResponse(error));
        } else {
          response.send(utils.createSuccessResponse(results));
        }
      });
    }
  );

  // ADD STUDENT TO A GROUP
router.post(
    "/add-student-group",
    authorizeRole(["coordinator"]),
    (request, response) => {
      const { email, group_name } = request.body;
  
      // Check if the group exists
      const groupQuery = `SELECT group_id FROM ${GROUP_TABLE} WHERE group_name = ?`;
      db.execute(groupQuery, [group_name], (groupError, groupResults) => {
        if (groupError) {
          response
            .status(500)
            .send(utils.createErrorResponse(groupError.message));
          return;
        }
  
        if (groupResults.length === 0) {
          response.status(404).send(utils.createErrorResponse("Group not found"));
          return;
        }
  
        const group_id = groupResults[0].group_id;
  
        // Check if the student exists
        const studentQuery = `SELECT student_id 
        FROM ${STUDENT_TABLE} 
        WHERE email = ?`;
  
        db.execute(studentQuery, [email], (studentError, studentResults) => {
          if (studentError) {
            response
              .status(500)
              .send(utils.createErrorResponse(studentError.message));
            return;
          }
  
          if (studentResults.length === 0) {
            response
              .status(404)
              .send(utils.createErrorResponse("Student not found"));
            return;
          }
  
          const student_id = studentResults[0].student_id;
  
          // Add student to the group
          const addStudentToGroupQuery = `UPDATE ${STUDENT_TABLE} 
          SET group_id = ? WHERE email = ?`;
  
          db.execute(
            addStudentToGroupQuery,
            [group_id, email],
            (addError, addResult) => {
              if (addError) {
                response
                  .status(500)
                  .send(utils.createErrorResponse(addError.message));
                return;
              }
  
              response.send(
                utils.createSuccessResponse("Student added to group successfully")
              );
            }
          );
        });
      });
    }
  );

  // SHOW STUDENTS WITH GROUPS
router.get(
    "/students-with-groups",
    authorizeRole(["coordinator"]),
    (request, response) => {
      const query = `
          SELECT s.student_id, s.roll_number, s.student_name, s.email, c.group_name
          FROM ${STUDENT_TABLE} s
          INNER JOIN ${GROUP_TABLE} c ON s.group_id = c.group_id;
        `;
  
      db.execute(query, (error, results) => {
        if (error) {
          response.status(500).json(utils.createErrorResponse(error));
        } else {
          response.json(utils.createSuccessResponse(results));
        }
      });
    }
  );

  // MARK ENTRY OF STUDENT
router.post(
    "/mark-entry",
    authorizeRole(["coordinator"]),
    (request, response) => {
      const {
        student_name,
        subject_name,
        group_name,
        staff_name,
        component,
        marks,
        entry_date,
      } = request.body;
  
      // Check if the student exists
      const studentQuery = `SELECT student_id 
        FROM ${STUDENT_TABLE} 
        WHERE student_name = ?`;
  
      db.execute(studentQuery, [student_name], (studentError, studentResults) => {
        if (studentError) {
          response.status(500).send(utils.createErrorResponse(studentError));
          return;
        }
  
        if (studentResults.length === 0) {
          response
            .status(404)
            .send(utils.createErrorResponse("Student Not Found"));
          return;
        }
  
        const student_id = studentResults[0].student_id;
  
        console.log("student_id " + student_id);
  
        // Check if the subject exists
        const subjectQuery = `SELECT subject_id 
                FROM ${SUBJECT_TABLE} 
                WHERE subject_name = ?`;
  
        db.execute(
          subjectQuery,
          [subject_name],
          (subjectError, subjectResults) => {
            if (subjectError) {
              response.status(500).send(utils.createErrorResponse(subjectError));
              return;
            }
  
            if (subjectResults.length === 0) {
              response
                .status(404)
                .send(utils.createErrorResponse("Subject Not Found"));
              return;
            }
  
            const subject_id = subjectResults[0].subject_id;
  
            // Check if the group exists
            const groupQuery = `SELECT group_id, course_id 
                  FROM ${GROUP_TABLE} 
                  WHERE group_name = ?`;
  
            db.execute(groupQuery, [group_name], (groupError, groupResults) => {
              if (groupError) {
                response.status(500).send(utils.createErrorResponse(groupError));
                return;
              }
  
              if (groupResults.length === 0) {
                response
                  .status(404)
                  .send(utils.createErrorResponse("Group Not Found"));
                return;
              }
  
              const group_id = groupResults[0].group_id;
              const course_id = groupResults[0].course_id;
              console.log("group_id ", group_id);
              console.log("group_id ", group_id);
  
              // Check if the staff exists
              const staffQuery = `SELECT staff_id 
                FROM ${STAFF_TABLE} 
                WHERE staff_name = ?`;
  
              db.execute(staffQuery, [staff_name], (staffError, staffResults) => {
                if (staffError) {
                  response
                    .status(500)
                    .send(utils.createErrorResponse(staffError));
                  return;
                }
  
                if (staffResults.length === 0) {
                  response
                    .status(404)
                    .send(
                      utils.createErrorResponse("Staff Member Doesn't Exist")
                    );
                  return;
                }
  
                const staff_id = staffResults[0].staff_id;
  
                // Insert marks entry into MarksEntry table
                const insertQuery = `INSERT INTO ${MARKS_ENTRY_TABLE} 
              (student_id, subject_id, group_id, course_id, staff_id, component, marks, entry_date)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

//             const insertQuery = `INSERT INTO ${MARKS_ENTRY_TABLE} 
//   (student_id, subject_id, group_id, course_id, staff_id, marks, entry_date)
//   VALUES (?, ?, ?, ?, ?, ?, ?);`
  
                console.log("insert Query: " + insertQuery);
                console.log(
                  student_id,
                  subject_id,
                  group_id,
                  course_id,
                  staff_id,
                  component,
                  marks,
                  entry_date
                );
  
                db.execute(
                  insertQuery,
                  [
                    student_id,
                    subject_id,
                    group_id,
                    course_id,
                    staff_id,
                    component,
                    marks,
                    entry_date,
                  ],
                  (insertError, insertResult) => {
                    if (insertError) {
                      response
                        .status(500)
                        .send(utils.createErrorResponse(insertError));
                    } else {
                      response.send(
                        utils.createResponse(insertError, insertResult)
                      );
                    }
                  }
                );
              });
            });
          }
        );
      });
    }
  );


  // SHOW ALL STUDENT MARKS
router.get(
    "/show-marks",
    authorizeRole(["coordinator"]),
    (request, response) => {
      const query = `
      SELECT 
        Students.roll_number,
        Students.student_name,
        Course_Groups.group_name, 
        Subjects.subject_name, 
        Courses.course_name, 
        MarksEntry.marks
      FROM MarksEntry
      INNER JOIN Students ON MarksEntry.student_id = Students.student_id
      INNER JOIN Course_Groups ON MarksEntry.group_id = Course_Groups.group_id
      INNER JOIN Subjects ON MarksEntry.subject_id = Subjects.subject_id
      INNER JOIN Courses ON Course_Groups.course_id = Courses.course_id
    `;
  
      db.execute(query, (error, results) => {
        if (error) {
          response.status(500).send(utils.createErrorResponse(error));
        } else {
          response.send(utils.createSuccessResponse(results));
        }
      });
    }
  );

  // GET ALL GROUPS PRESENT IN A COURSE
router.post("/course-groups", authorizeRole(["coordinator"]), (req, res) => {
    // Extract course name from request body
    const { course_name } = req.body;
  
    // SQL query to select group names and corresponding course names
    const query = `
      SELECT Course_Groups.group_name
      FROM Course_Groups
      INNER JOIN Courses ON Course_Groups.course_id = Courses.course_id
      WHERE Courses.course_name = ?
    `;
  
    // Execute the SQL query
    db.query(query, [course_name], (error, results) => {
      if (error) {
        // Handle error
        console.error("Error fetching course groups:", error);
        res.status(500).send(utils.createErrorResponse(error));
      } else {
        // Send the response with the retrieved data
        res.send(utils.createSuccessResponse(results));
      }
    });
  });

  // GET ALL SUBJECTS PRESENT IN A COURSE
router.post("/course-subjects", authorizeRole(["coordinator"]), (req, res) => {
    // Extract course name from request body
    const { course_name } = req.body;
  
    // SQL query to select subjects related to the specified course
    const query = `
      SELECT Subjects.subject_name
      FROM Subjects
      INNER JOIN Courses ON Subjects.course_id = Courses.course_id
      WHERE Courses.course_name = ?
    `;
  
    // Execute the SQL query
    db.query(query, [course_name], (error, results) => {
      if (error) {
        // Handle error
        console.error("Error fetching course subjects:", error);
        res.status(500).send(utils.createErrorResponse(error));
      } else {
        // Send the response with the retrieved data
        res.send(utils.createSuccessResponse(results));
      }
    });
  });

  // ADD STUDENT TO A COURSE
router.post(
    "/add-student-course",
    authorizeRole(["coordinator"]),
    (request, response) => {
      const { email, course_name } = request.body;
  
      // Check if the course exists
      const courseQuery = `SELECT course_id FROM ${COURSE_TABLE} WHERE course_name = ?`;
      db.execute(courseQuery, [course_name], (courseError, courseResults) => {
        if (courseError) {
          response
            .status(500)
            .send(utils.createErrorResponse(courseError.message));
          return;
        }
  
        if (courseResults.length === 0) {
          response
            .status(404)
            .send(utils.createErrorResponse("Course not found"));
          return;
        }
  
        const course_id = courseResults[0].course_id;
  
        // Check if the student exists
        const studentQuery = `SELECT student_id 
        FROM ${STUDENT_TABLE} 
        WHERE email = ?`;
  
        db.execute(studentQuery, [email], (studentError, studentResults) => {
          if (studentError) {
            response
              .status(500)
              .send(utils.createErrorResponse(studentError.message));
            return;
          }
  
          if (studentResults.length === 0) {
            response
              .status(404)
              .send(utils.createErrorResponse("Student not found"));
            return;
          }
  
          const student_id = studentResults[0].student_id;
  
          // Add student to the course
          const addStudentToCourseQuery = `UPDATE ${STUDENT_TABLE} 
          SET course_id = ? WHERE email = ?`;
  
          db.execute(
            addStudentToCourseQuery,
            [course_id, email],
            (addError, addResult) => {
              if (addError) {
                response
                  .status(500)
                  .send(utils.createErrorResponse(addError.message));
                return;
              }
  
              response.send(
                utils.createSuccessResponse(
                  "Student added to course successfully"
                )
              );
            }
          );
        });
      });
    }
  );


  // SHOW STUDENTS WITHOUT COURSE AND GROUP
router.get(
  "/show-students",
  authorizeRole(["coordinator"]),
  (request, response) => {
    const query = `
    SELECT s.student_id, s.roll_number, s.student_name, s.email
    FROM ${STUDENT_TABLE} s
    LEFT JOIN ${COURSE_TABLE} c ON s.course_id = c.course_id
    LEFT JOIN ${GROUP_TABLE} g ON s.group_id = g.group_id
    WHERE s.course_id IS NULL AND s.group_id IS NULL;
  `;

    db.execute(query, (error, results) => {
      if (error) {
        response.status(500).json(utils.createErrorResponse(error));
      } else {
        response.json(utils.createSuccessResponse(results));
      }
    });
  }
);

// SHOW STUDENTS WITH SPECIFIC COURSE BUT WITHOUT GROUP
router.get(
  "/student-with-course",
  authorizeRole(["coordinator"]),
  (request, response) => {
    // Extract the course name from the request query parameters
    const { course_name } = request.query;

    // Construct the SQL query
    const query = `
    SELECT s.student_id, s.roll_number, s.student_name, s.email, c.course_name
    FROM ${STUDENT_TABLE} s
    INNER JOIN ${COURSE_TABLE} c ON s.course_id = c.course_id
    LEFT JOIN ${GROUP_TABLE} g ON s.group_id = g.group_id
    WHERE s.group_id IS NULL
    AND c.course_name = ?;
  `;

    // Execute the query with the course name parameter
    db.execute(query, [course_name], (error, results) => {
      if (error) {
        response.status(500).json(utils.createErrorResponse(error));
      } else {
        response.json(utils.createSuccessResponse(results));
      }
    });
  }
);

// SHOW STUDENTS WITH SPECIFIC COURSE AND GROUPS PRESENT IN IT
router.get(
  "/student-with-course-groups",
  authorizeRole(["coordinator"]),
  (request, response) => {
    // Extract the course name from the request query parameters
    const { course_name } = request.query;

    // Construct the SQL query
    const query = `
    SELECT s.student_id, s.roll_number, s.student_name, s.email, c.course_name, g.group_name
    FROM ${STUDENT_TABLE} s
    INNER JOIN ${COURSE_TABLE} c ON s.course_id = c.course_id
    INNER JOIN ${GROUP_TABLE} g ON s.group_id = g.group_id
    WHERE c.course_name = ?;
  `;

    // Execute the query with the course name parameter
    db.execute(query, [course_name], (error, results) => {
      if (error) {
        response.status(500).json(utils.createErrorResponse(error));
      } else {
        response.json(utils.createSuccessResponse(results));
      }
    });
  }
);
  

// SHOW STAFF NAMES
router.post(
  "/show-staff",
  authorizeRole(["coordinator"]),
  (request, response) => {
    const { course_name } = request.body;
    console.log("course_name ", course_name);

    const query = `
      SELECT ${STAFF_TABLE}.staff_id, ${STAFF_TABLE}.staff_name
      FROM ${STAFF_TABLE}
      JOIN ${COURSE_TABLE}
      ON ${STAFF_TABLE}.course_name = ${COURSE_TABLE}.course_name
      WHERE ${COURSE_TABLE}.course_name = ? AND ${STAFF_TABLE}.role = 'staff';
    `;

    console.log("query ", query);

    db.execute(query, [course_name], (error, results) => {
      if (error) {
        response.send(utils.createErrorResponse(error));
      } else {
        response.send(utils.createSuccessResponse(results));
      }
    });
  }
);

  module.exports = router;