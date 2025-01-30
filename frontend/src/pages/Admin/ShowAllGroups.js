import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShowAllGroups = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchGroups(selectedCourse);
    }
  }, [selectedCourse]);

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

  const fetchGroups = async (courseName) => {
    try {
      const response = await axios.get(
        `http://localhost:7000/admin/show-groups?course_name=${courseName}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response && response.data && response.data.data) {
        setGroups(response.data.data);
      } else {
        console.error("Invalid response");
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const handleShowGroups = () => {
    if (!selectedCourse) {
      console.error("No course selected");
      return;
    }
    fetchGroups(selectedCourse);
  };

  const handleAddGroup = async () => {
    if (!selectedCourse || !newGroupName) {
      console.error("Selected course or group name is missing");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:7000/admin/add-group",
        { course_name: selectedCourse, group_name: newGroupName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data);
      toast.success(`Group Added Successfully...`);
      // Reset the input field
      setNewGroupName("");
      // Assuming you want to update the groups after adding a new one
      fetchGroups(selectedCourse);
    } catch (error) {
      toast.error("Error Adding Group: " + error.message);
      console.error("Error adding group:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Show All Groups</h1>

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
              onClick={handleShowGroups} // Handle show groups button click
              className="ms-3"
            >
              Show Groups
            </Button>
          </Form.Group>
        </Card.Body>
      </Card>

      <Card className="mb-4" style={{ width: "60%", margin: "auto" }}>
        <Card.Body>
          <h2 className="text-center mb-4">Groups for {selectedCourse}</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Group Name</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group, index) => (
                <tr key={index}>
                  <td>{group.group_name}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Form.Group className="mb-3 d-flex align-items-center">
            <Form.Label className="me-3">Add Group:</Form.Label>
            <Form.Control
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <Button
              variant="primary"
              onClick={handleAddGroup} // Handle add group button click
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

export default ShowAllGroups;
