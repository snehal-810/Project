import React from "react";
import { Card, Container } from "react-bootstrap";

function Home() {
  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Card.Title>Welcome to Marks Entry App</Card.Title>
          <Card.Text>
            This application allows you to easily manage and enter marks for
            students.
          </Card.Text>
          <Card.Text>
            You can navigate through different functionalities by login
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Home;
