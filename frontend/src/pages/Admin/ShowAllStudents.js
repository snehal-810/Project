import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Form, Table } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShowAllStudents = () => {
  const [students, setStudents] = useState([]);
  const [courseNames, setCourseNames] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState({});
  const [showStudentsOfCourse, setShowStudentsOfCourse] = useState(false);
  const [selectedCourseForStudents, setSelectedCourseForStudents] =
    useState("");
  const [studentsOfSelectedCourse, setStudentsOfSelectedCourse] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch course names
        const courseNamesResponse = await axios.get(
          "http://localhost:7000/admin/show-courses",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCourseNames(courseNamesResponse.data.data);

        // Fetch all students
        const allStudentsResponse = await axios.get(
          "http://localhost:7000/admin/show-all-students",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setStudents(allStudentsResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSave = (email) => {
    const selectedCourse = selectedCourses[email];
    if (!selectedCourse) {
      toast.error("Please select a course");
      return;
    }

    axios
      .post(
        "http://localhost:7000/admin/add-student-to-course",
        { email: email, course_name: selectedCourse },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log("response ", response);
        toast.success("Successfully added to course");

        // Fetch updated student data
        const fetchUpdatedStudents = async () => {
          try {
            const allStudentsResponse = await axios.get(
              "http://localhost:7000/admin/show-all-students",
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            setStudents(allStudentsResponse.data.data);
          } catch (error) {
            console.error("Error fetching updated student data:", error);
          }
        };

        fetchUpdatedStudents();
      })
      .catch((error) => {
        console.error("Error adding student to course:", error);
        toast.error("Failed to add student to course");
      });
  };

  const handleSelectCourse = (email, selectedCourse) => {
    setSelectedCourses({ ...selectedCourses, [email]: selectedCourse });
  };

  const handleShowStudentsOfCourse = async () => {
    try {
      const studentsResponse = await axios.get(
        `http://localhost:7000/admin/students-with-course?course_name=${selectedCourseForStudents}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setStudentsOfSelectedCourse(studentsResponse.data.data);
      setShowStudentsOfCourse(true);
    } catch (error) {
      console.error("Error fetching students of selected course:", error);
    }
  };

  const handleSelectCourseForStudents = (e) => {
    setSelectedCourseForStudents(e.target.value);
  };

  return (
    <div className="container">
      <h1 className="text-center mb-4 mt-4">All Students</h1>
      <Card className="mt-4 p-4 shadow">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Student Name</th>
              <th>Email</th>
              <th>Add to Course</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index}>
                <td>{student.roll_number}</td>
                <td>{student.student_name}</td>
                <td>{student.email}</td>
                <td>
                  <Form.Select
                    aria-label="Select Course"
                    onChange={(e) =>
                      handleSelectCourse(student.email, e.target.value)
                    }
                  >
                    <option>-</option>
                    {courseNames.map((course, courseIndex) => (
                      <option key={courseIndex} value={course.course_name}>
                        {course.course_name}
                      </option>
                    ))}
                  </Form.Select>
                </td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleSave(student.email)}
                  >
                    Save
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />

      <Card className="mt-4 p-4 shadow">
        <h2 className="text-center mb-4">Show Students of Selected Course</h2>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="me-3">
            <label className="me-2">Select Course Name:</label>
            <Form.Select
              aria-label="Select Course Name"
              onChange={handleSelectCourseForStudents}
            >
              <option>-</option>
              {courseNames.map((course, index) => (
                <option key={index} value={course.course_name}>
                  {course.course_name}
                </option>
              ))}
            </Form.Select>
          </div>
          <Button variant="primary" onClick={handleShowStudentsOfCourse}>
            Show Students
          </Button>
        </div>
        {showStudentsOfCourse && (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Roll Number</th>
                <th>Student Name</th>
                <th>Email</th>
                <th>Course Name</th>
              </tr>
            </thead>
            <tbody>
              {studentsOfSelectedCourse.map((student, index) => (
                <tr key={index}>
                  <td>{student.roll_number}</td>
                  <td>{student.student_name}</td>
                  <td>{student.email}</td>
                  <td>{student.course_name}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default ShowAllStudents;
