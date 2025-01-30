import React, { useContext } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { AuthContext } from "../../helpers/AuthContext";

const StaffHome = () => {
  const [authState, setAuthState] = useContext(AuthContext);
  console.log("Staff authState ", authState);

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
          <Card.Text>To the Mark Entry Staff Home page!</Card.Text>
          {/* Add your content here */}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StaffHome;
