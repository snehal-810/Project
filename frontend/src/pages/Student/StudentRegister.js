import axios from "axios";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const history = useHistory();
  const [formData, setFormData] = useState({
    student_name: "",
    roll_number: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate inputs
    if (
      !formData.student_name.trim() ||
      !formData.roll_number.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:7000/student/register",
        formData
      );
      console.log(response.data);
      setFormData({
        student_name: "",
        roll_number: "",
        email: "",
        password: "",
      });
      toast.success("Registration successful");
      setTimeout(() => {
        history.push("/student/login");
      }, 1000);
    } catch (error) {
      console.error("Error registering student:", error);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card
        style={{
          width: "60%",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Card.Body>
          <Card.Title>Student Register</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formGroupName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="student_name"
                value={formData.student_name}
                onChange={handleChange}
                placeholder="Enter name"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupRollNumber">
              <Form.Label>Roll Number</Form.Label>
              <Form.Control
                type="text"
                name="roll_number"
                value={formData.roll_number}
                onChange={handleChange}
                placeholder="Enter roll number"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Register
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </Container>
  );
}

export default Register;
