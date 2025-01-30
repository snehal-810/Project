import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Card, Table, Button, Form, Row, Col } from "react-bootstrap";
import { AuthContext } from "../../helpers/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddMarkScheme = () => {
  const [authState] = useContext(AuthContext);

  const [evaluationScheme, setEvaluationScheme] = useState([]);
  const [newScheme, setNewScheme] = useState({
    theoryMarks: 0,
    labMarks: 0,
    ia1Marks: 0,
    ia2Marks: 0,
  });
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "subjectId") {
      setSelectedSubject(value);
    } else {
      setNewScheme({ ...newScheme, [name]: value });
    }
  };

  const handleSaveMarks = () => {
    console.log("newScheme ", newScheme);
    console.log("selectedSubject ", selectedSubject);
    console.log("courseName ", authState.course_name);

    axios
      .post(
        `http://localhost:7000/coordinator/add-marking-schema`,
        {
          theory_weightage: newScheme.theoryMarks,
          lab_weightage: newScheme.labMarks,
          ia1_weightage: newScheme.ia1Marks,
          ia2_weightage: newScheme.ia2Marks,
          subject_name: selectedSubject,
          course_name: authState.course_name,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        toast.success("Scheme Added Successfully!");
        console.log("Scheme added successfully:", response.data);
        fetchEvaluationScheme();
        setNewScheme({
          theoryMarks: "",
          labMarks: "",
          ia1Marks: "",
          ia2Marks: "",
        });
        // setSubjectOptions();
        // Refresh the data to display the newly added scheme
        // You can either reload the page or fetch the data again from the server
      })
      .catch((error) => {
        console.error("Error adding scheme:", error);
      });
  };

  const fetchEvaluationScheme = async () => {
    try {
      if (authState.role === "coordinator") {
        const response = await axios.get(
          `http://localhost:7000/coordinator/show-schema?course_name=${authState.course_name}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response && response.data) {
          console.log("response.data", response.data);

          setEvaluationScheme(response.data.data);
        } else {
          console.error("Invalid response or course name");
        }
      } else {
        console.error("User is not a coordinator");
      }
    } catch (error) {
      console.error("Error fetching evaluation scheme:", error);
    }
  };

  // Fetch course subjects and evaluation scheme on component mount
  useEffect(() => {
    const fetchCourseSubjects = async () => {
      try {
        if (authState.role === "coordinator") {
          const response = await axios.post(
            `http://localhost:7000/coordinator/course-subjects`,
            {
              course_name: authState.course_name,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (response && response.data) {
            setSubjectOptions(response.data.data);
          } else {
            console.error("Invalid response");
          }
        } else {
          console.error("User is not a coordinator");
        }
      } catch (error) {
        console.error("Error fetching course subjects:", error);
      }
    };

    fetchCourseSubjects();
    fetchEvaluationScheme();
  }, [authState]);

  const handleSave = () => {
    toast.warning("Not Implemented");
    console.log("Mark scheme saved:", evaluationScheme);
  };

  return (
    <div className="container ">
      <h1 className="text-center mb-4 mt-4">Course: {authState.course_name}</h1>
      <h3 className="text-center mb-4 mt-4">Show All Mark Scheme</h3>
      <Card className="mt-4 p-4 shadow">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Subject Name</th>
              <th>Theory</th>
              <th>Lab</th>
              <th>IA1</th>
              <th>IA2</th>
            </tr>
          </thead>
          <tbody>
            {evaluationScheme.map((data, index) => (
              <tr key={index}>
                <td>{data.subject_name}</td>
                <td>{data.theory_weightage}</td>
                <td>{data.lab_weightage}</td>
                <td>{data.ia1_weightage}</td>
                <td>{data.ia2_weightage}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        {/* <div className="text-center">
          <Button variant="primary" onClick={handleSave}>
            Save Mark Scheme
          </Button>
        </div> */}
      </Card>

      <Card
        className="mt-4 p-4 shadow"
        style={{ width: "50%", margin: "0 auto" }}
      >
        <h3 className="text-center mb-4">Add Marks To Subject</h3>
        <Form>
          <Form.Select
            name="subjectId"
            value={selectedSubject}
            onChange={handleInputChange}
          >
            <option value="">Select a subject</option>
            {subjectOptions.map((subject) => (
              <option key={subject.subject_name} value={subject.subject_name}>
                {subject.subject_name}
              </option>
            ))}
          </Form.Select>

          <Row className="mb-3 mt-3">
            <Col>
              <Form.Group controlId="theoryMarks">
                <Form.Label>Theory Marks</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter theory marks"
                  name="theoryMarks"
                  value={newScheme.theoryMarks}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="labMarks">
                <Form.Label>Lab Marks</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter lab marks"
                  name="labMarks"
                  value={newScheme.labMarks}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group controlId="ia1Marks">
                <Form.Label>IA1 Marks</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter IA1 marks"
                  name="ia1Marks"
                  value={newScheme.ia1Marks}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="ia2Marks">
                <Form.Label>IA2 Marks</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter IA2 marks"
                  name="ia2Marks"
                  value={newScheme.ia2Marks}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="text-center ">
            <Button variant="primary" onClick={handleSaveMarks}>
              Save
            </Button>
          </div>
        </Form>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddMarkScheme;
