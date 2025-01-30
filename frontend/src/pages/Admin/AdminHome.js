import React, { useContext } from "react";
import { Card, Container } from "react-bootstrap";
import { AuthContext } from "../../helpers/AuthContext";

const AdminHome = () => {
  const [authState] = useContext(AuthContext);

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card
        style={{
          width: "60%",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
          padding: "20px",
        }}
      >
        <Card.Body>
          <Card.Title>Welcome, {authState.name}</Card.Title>
          <Card.Text>This is the Admin Home page!</Card.Text>
          {/* Add your content here */}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminHome;
