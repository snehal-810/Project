import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const [name, setName] = useState("");
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate inputs
    if (
      !name.trim() ||
      !employeeNumber.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      toast.error("All fields are required");
      return;
    }

    // Make POST request to register staff
    axios
      .post("http://localhost:7000/staff/register", {
        staff_name: name,
        employee_number: employeeNumber,
        email: email,
        password: password,
      })
      .then((response) => {
        toast.success("Registration successful");

        setTimeout(() => {
          history.push("/staff/login");
        }, 1000);

        // Handle success, maybe redirect to login page
      })
      .catch((error) => {
        toast.error("Registration failed. Please try again.");
        console.error(error);
      });
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
          <Card.Title>Staff Register</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formGroupName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupRollNumber">
              <Form.Label>Employee Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter roll number"
                value={employeeNumber}
                onChange={(e) => setEmployeeNumber(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
