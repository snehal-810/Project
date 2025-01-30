import React, { useContext, useState } from "react";
import { Card, Container, Form, Button } from "react-bootstrap";
import { AuthContext } from "../../helpers/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function StaffLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authState, setAuthState] = useContext(AuthContext);
  const history = useHistory();

  const handleLogin = (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Validate email and password
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }

    const data = { email: email, password: password };

    axios
      .post("http://localhost:7000/staff/login", data)
      .then((response) => {
        if (response.data.error) {
          toast.error(response.data.error);
        } else {
          localStorage.setItem("token", response.data.data.token);
          const decodedToken = jwtDecode(response.data.data.token);
          console.log("deToken SL", decodedToken);

          if (decodedToken.role === "admin") {
            setAuthState({
              name: response.data.data.staff_name,
              id: decodedToken.staff_id,
              status: true,
              role: decodedToken.role,
              course_name: "",
            });
          }

          // for "coordinator" and "staff"
          setAuthState({
            name: response.data.data.staff_name,
            id: decodedToken.staff_id,
            status: true,
            role: decodedToken.role,
            course_name: decodedToken.course_name,
          });

          toast.success("Login successful");
          setTimeout(() => {
            switch (decodedToken.role) {
              case "staff":
                history.push("/staff/home");
                break;
              case "coordinator":
                history.push("/coco/home");
                break;
              case "admin":
                history.push("/admin/home");
                break;
              default:
                history.push("/staff/login");
            }
          }, 1000);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("An error occurred. Please try again.");
      });
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card style={{ width: "60%", boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)" }}>
        <Card.Body>
          <Card.Title>Staff Login</Card.Title>
          <Form onSubmit={handleLogin}>
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
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button type="submit" variant="primary">
                Login
              </Button>
              <Button
                variant="primary"
                onClick={() => history.push("/staff/register")}
              >
                Register
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </Container>
  );
}

export default StaffLogin;
