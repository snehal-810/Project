import React, { useState, useEffect } from "react";
import { Card, Table, Button, Form } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShowAllStaffs = () => {
  const [staffs, setStaffs] = useState([]);
  const [email, setEmail] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedRole, setSelectedRole] = useState("staff");
  const [courseNames, setCourseNames] = useState([]);

  const fetchData = async () => {
    try {
      const staffResponse = await axios.get(
        "http://localhost:7000/admin/all-staff",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setStaffs(
        staffResponse.data.data.filter((staff) => staff.role !== "admin")
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseResponse = await axios.get(
          "http://localhost:7000/admin/show-courses",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCourseNames(courseResponse.data.data);
      } catch (error) {
        console.error("Error fetching course data:", error);
        toast.error("Failed to fetch course data");
      }
    };

    fetchData();
    fetchCourses();
  }, []);

  const handleChangeRole = () => {
    if (!email) {
      toast.error("Please enter email");
      return;
    }

    axios
      .put(
        "http://localhost:7000/admin/update-staff-details",
        {
          email: email,
          role: selectedRole,
          course_name: selectedCourse,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        toast.success("Staff details updated successfully");

        // After successful update, fetch the updated staff data again
        fetchData();
        setEmail(""); // Reset email to blank
        setSelectedCourse(""); // Reset selected course to blank
        setSelectedRole("staff"); // Reset selected role to "staff"
      })
      .catch((error) => {
        console.error("Error updating staff details:", error);
        toast.error("Failed to update staff details");
      });
  };

  return (
    <div className="container">
      <h1 className="text-center mb-4 mt-4">All Staffs</h1>
      <Card className="mt-4 p-4 shadow">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Staff Name</th>
              <th>Email</th>
              <th>Course Name</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {staffs.map((staff, index) => (
              <tr key={index}>
                <td>{staff.employee_number}</td>
                <td>{staff.staff_name}</td>
                <td>{staff.email}</td>
                <td>{staff.course_name}</td>
                <td>{staff.role}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
      <Card
        className="mt-4 p-4 shadow"
        style={{ width: "60%", margin: "auto" }}
      >
        <h2 className="text-center mb-3">Update Staff Details</h2>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCourse">
            <Form.Label>Select Course</Form.Label>
            <Form.Select
              aria-label="Select Course"
              onChange={(e) => setSelectedCourse(e.target.value)}
              value={selectedCourse}
            >
              <option>-</option>
              {courseNames.map((course, courseIndex) => (
                <option key={courseIndex} value={course.course_name}>
                  {course.course_name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicRole">
            <Form.Label>Select Role</Form.Label>
            <Form.Select
              aria-label="Select Role"
              onChange={(e) => setSelectedRole(e.target.value)}
              value={selectedRole}
            >
              <option value="staff">Staff</option>
              <option value="coordinator">Coordinator</option>
            </Form.Select>
          </Form.Group>
          <Button variant="primary" onClick={handleChangeRole}>
            Update
          </Button>
        </Form>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ShowAllStaffs;
