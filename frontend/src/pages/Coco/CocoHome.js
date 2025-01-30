// import React, { useContext } from "react";
// import Card from "react-bootstrap/Card";
// import Container from "react-bootstrap/Container";
// import { AuthContext } from "../../helpers/AuthContext";

// const CocoHome = () => {
//   const [authState, setAuthState] = useContext(AuthContext);
//   return (
//     <Container
//       className="d-flex justify-content-center align-items-center"
//       style={{ minHeight: "100vh" }}
//     >
//       <Card
//         style={{
//           width: "60%",
//           boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
//           padding: "20px",
//         }}
//       >
//         <Card.Body>
//           <Card.Title>Welcome, {authState.name}</Card.Title>
//           <Card.Text>This is the Coco Home page!</Card.Text>
//           {/* Add your content here */}
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };

// export default CocoHome;
import React, { useContext } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { AuthContext } from "../../helpers/AuthContext";
// import Dropdown from "react-bootstrap/Dropdown";
// import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";

const CocoHome = () => {
  const [authState] = useContext(AuthContext);

  const dropdownLinks = [
    { to: "/coco/show-students", text: "Show Students" },
    { to: "/coco/add-mark-scheme", text: "Add Mark Scheme" },
    { to: "/coco/add-evaluation", text: "Add Evaluation" },
    { to: "/coco/assigned-task", text: "Assigned Task" },
    { to: "/coco/show-completed-tasks", text: "Show Completed Tasks" },
  ];

  const boxColors = [
    "linear-gradient(to bottom right, #ff7e5f, #feb46a)",
    "linear-gradient(to bottom right, #ffd63b, #ff7e5f)",
    "linear-gradient(to bottom right, #2bc0e4, #eaecc6)",
    "linear-gradient(to bottom right, #56ab2f, #a8e063)",
    "linear-gradient(to bottom right, #3a1c71, #d76d77, #ffaf7b)",
  ];

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card
        className="text-center"
        style={{
          width: "60%",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
          padding: "20px",
        }}
      >
        <Card.Body>
          <Card.Title>Welcome, {authState.name}</Card.Title>
          <Card.Text>This is the Coco Home page!</Card.Text>
          <div className="d-flex justify-content-center">
            {dropdownLinks.map((link, index) => (
              <Link
                key={index}
                to={link.to}
                className="m-2"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "10px",
                  background: boxColors[index % boxColors.length],
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#fff",
                  fontWeight: "bold",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                  textDecoration: "none",
                }}
              >
                {link.text}
              </Link>
            ))}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CocoHome;
