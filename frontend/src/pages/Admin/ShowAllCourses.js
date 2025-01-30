import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShowAllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [newCourseName, setNewCourseName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [newSubjectName, setNewSubjectName] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:7000/admin/show-courses",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response && response.data && response.data.data) {
        setCourses(response.data.data);
      } else {
        console.error("Invalid response");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleFetchSubjects = async () => {
    if (!selectedCourse) {
      toast.error("Please select a course");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:7000/admin/show-subjects/${selectedCourse}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response && response.data && response.data.data) {
        setSubjects(response.data.data);
      } else {
        console.error("Invalid response");
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const handleAddSubject = async () => {
    if (!selectedCourse || !newSubjectName) {
      toast.error("Please select a course and enter a subject name");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:7000/admin/add-subject",
        {
          course_name: selectedCourse,
          subject_name: newSubjectName,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response && response.data && response.data.status === "success") {
        toast.success("Subject added successfully");
        // Refresh the list of subjects after adding a new subject
        handleFetchSubjects();
        setNewSubjectName(""); // Clear input field after adding subject
      } else {
        console.error("Invalid response");
        toast.error("Failed to add subject");
      }
    } catch (error) {
      console.error("Error adding subject:", error);
      toast.error("Failed to add subject");
    }
  };

  const handleAddCourse = async () => {
    try {
      const response = await axios.post(
        "http://localhost:7000/admin/add-course",
        {
          course_name: newCourseName,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("response", response);
      console.log("response.data", response.data);
      console.log("r.d.d", response.data.data);

      if (response && response.data && response.data.status === "success") {
        toast.success("Course added successfully");
        // Refresh the list of courses after adding a new course
        fetchCourses();
        setNewCourseName(""); // Clear input field after adding course
      } else {
        console.error("Invalid response");
        toast.error("Failed to add course");
      }
    } catch (error) {
      console.error("Error adding course:", error);
      toast.error("Failed to add course");
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Show All Courses</h1>
      <Card className="mb-4" style={{ width: "60%", margin: "auto" }}>
        <Card.Body>
          <Form.Group className="mb-2 d-flex align-items-center">
            <Form.Label className="me-3">Add Course:</Form.Label>
            <Form.Control
              type="text"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
            />
            <Button
              variant="primary"
              onClick={handleAddCourse}
              className="ms-3"
            >
              Add
            </Button>
          </Form.Group>
        </Card.Body>
      </Card>

      <Card className="mb-4" style={{ width: "60%", margin: "auto" }}>
        <Card.Body>
          <h2 className="text-center">All Courses</h2>
          <table
            className="table mt-4 mb-2 text-center"
            style={{ width: "40%", margin: "auto" }}
          >
            <thead>
              <tr>
                <th>Course Name</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.course_id}>
                  <td>{course.course_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card.Body>
      </Card>

      <Card className="mb-4" style={{ width: "60%", margin: "auto" }}>
        <Card.Body>
          <Form.Group className="mb-3 d-flex align-items-center">
            <Form.Label className="me-3">Select Course:</Form.Label>
            <Form.Select
              aria-label="Select Course"
              onChange={(e) => setSelectedCourse(e.target.value)}
              value={selectedCourse}
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.course_id} value={course.course_name}>
                  {course.course_name}
                </option>
              ))}
            </Form.Select>
            <Button
              variant="primary"
              onClick={handleFetchSubjects}
              className="ms-3"
            >
              Show Subjects
            </Button>
          </Form.Group>
        </Card.Body>
      </Card>

      <Card className="mb-4" style={{ width: "60%", margin: "auto" }}>
        <Card.Body>
          <h2 className="text-center ">Subjects</h2>
          <table
            className="table mt-4 mb-4 text-center"
            style={{ width: "40%", margin: "auto" }}
          >
            <thead>
              <tr>
                <th>Subject Name</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.subject_id}>
                  <td>{subject.subject_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Form.Group className="mb-3 d-flex align-items-center">
            <Form.Label className="me-3">Add Subject:</Form.Label>
            <Form.Control
              type="text"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
            />
            <Button
              variant="primary"
              onClick={handleAddSubject}
              className="ms-3"
            >
              Add
            </Button>
          </Form.Group>
        </Card.Body>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ShowAllCourses;
