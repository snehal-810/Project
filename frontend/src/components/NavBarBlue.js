import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { AuthContext } from "../helpers/AuthContext";
import { Dropdown } from "react-bootstrap";

const NavBarBlue = () => {
  const [authState, setAuthState] = useContext(AuthContext);
  const history = useHistory();

  // console.log("NavBar authState ", authState);

  const logout = () => {
    localStorage.removeItem("token");
    setAuthState({ name: "", id: 0, status: false, role: "" });
    history.push("/");
  };

  return (
    <Navbar bg="primary" data-bs-theme="dark">
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "24px",
            color: "#fff",
            cursor: "default",
            pointerEvents: "none",
          }}
        >
          Marks-Entry-App
        </Navbar.Brand>
        <Nav className="me-auto">
          {/* <Nav.Link as={Link} to="/">
            Home
          </Nav.Link> */}
          {authState.status ? (
            <>
              {authState.role === "student" && (
                <>
                  <Nav.Link as={Link} to="/student/home">
                    Home
                  </Nav.Link>
                  <Nav.Link as={Link} to="/student/show-marks">
                    Show Marks
                  </Nav.Link>
                </>
              )}
              {authState.role === "staff" && (
                <>
                  <Nav.Link as={Link} to="/staff/home">
                    Home
                  </Nav.Link>
                  <Nav.Link as={Link} to="/staff/pending-task">
                    Pending Task
                  </Nav.Link>
                  <Nav.Link as={Link} to="/staff/completed-tasks">
                    Completed Tasks
                  </Nav.Link>
                  {/* <Nav.Link as={Link} to="/staff/pending-task2">
                    Pending Task Up
                  </Nav.Link> */}
                  <Dropdown as={Nav.Item}>
                    <Dropdown.Toggle as={Nav.Link}>Test APIs</Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item as={Link} to="/staff/pending-task2">
                        Pending Task Updated
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              )}
              {authState.role === "coordinator" && (
                <>
                  {/* <Nav.Link as={Link} to="/coco/show-students">
                    Show Students
                  </Nav.Link>
                  <Nav.Link as={Link} to="/coco/add-mark-scheme">
                    Add Mark Scheme
                  </Nav.Link>
                  <Nav.Link as={Link} to="/coco/add-evaluation">
                    Add Evaluation
                  </Nav.Link>
                  <Nav.Link as={Link} to="/coco/assign-task">
                    Assign Task
                  </Nav.Link>
                  <Nav.Link as={Link} to="/show-task">
                    Show Tasks
                  </Nav.Link> */}
                  <Nav.Link as={Link} to="/coco/home">
                    Home
                  </Nav.Link>

                  <Dropdown as={Nav.Item}>
                    <Dropdown.Toggle as={Nav.Link}>Options</Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item as={Link} to="/coco/show-students">
                        Show Students
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/coco/add-mark-scheme">
                        Add Mark Scheme
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/coco/add-evaluation">
                        Add Evaluation
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/coco/assigned-task">
                        Assigned Task
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/coco/show-completed-tasks">
                        Show Completed Tasks
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <Dropdown as={Nav.Item}>
                    <Dropdown.Toggle as={Nav.Link}>Test APIs</Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item as={Link} to="/coco/add-evaluation2">
                        Add Evaluation 2
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/coco/assign-task2">
                        Assign Task 2
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              )}
              {authState.role === "admin" && (
                <>
                  <Nav.Link as={Link} to="/admin/home">
                    Home
                  </Nav.Link>
                  <Dropdown as={Nav.Item}>
                    <Dropdown.Toggle as={Nav.Link}>Options</Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item as={Link} to="/admin/show-all-students">
                        Show All Students
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/admin/show-all-staffs">
                        Show All Staffs
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/admin/show-all-courses">
                        Show All Courses
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/admin/show-all-groups">
                        Show All Groups
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              )}
              <Nav.Link onClick={logout}>Logout</Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to="/student/login">
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/student/register">
                Register
              </Nav.Link>
              <Nav.Link as={Link} to="/staff/login">
                Staff Login
              </Nav.Link>
            </>
          )}
        </Nav>
        {authState.status && (
          <Nav>
            <Nav.Item className="navbar-text">
              {authState.role && (
                <span className="me-2 text-light">{`${authState.role}: ${authState.name}`}</span>
              )}
            </Nav.Item>
          </Nav>
        )}
      </Container>
    </Navbar>
  );
};

export default NavBarBlue;
