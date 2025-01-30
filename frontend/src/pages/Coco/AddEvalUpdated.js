//TODO: SENDING SELECTED TASK AS WELL
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../helpers/AuthContext";

const AddEvalUpdated = () => {
  const [authState] = useContext(AuthContext);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [groupNames, setGroupNames] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [tillDate, setTillDate] = useState("");

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
            setSubjectOptions(
              response.data.data.map((subject) => subject.subject_name)
            );
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

    const fetchCourseGroups = async () => {
      try {
        if (authState.role === "coordinator") {
          const response = await axios.post(
            `http://localhost:7000/coordinator/course-groups`,
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
            setGroupNames(response.data.data.map((group) => group.group_name));
          } else {
            console.error("Invalid response");
          }
        } else {
          console.error("User is not a coordinator");
        }
      } catch (error) {
        console.error("Error fetching course groups:", error);
      }
    };

    const fetchStaffMembers = async () => {
      try {
        if (authState.role === "coordinator") {
          const response = await axios.post(
            `http://localhost:7000/coordinator/show-staff`,
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
            setStaffMembers(
              response.data.data.map((staff) => staff.staff_name)
            );
          } else {
            console.error("Invalid response");
          }
        } else {
          console.error("User is not a coordinator");
        }
      } catch (error) {
        console.error("Error fetching staff members:", error);
      }
    };

    fetchCourseSubjects();
    fetchCourseGroups();
    fetchStaffMembers();
  }, [authState]);

  const handleAssignTask = async () => {
    console.log("selectedGroup ", selectedGroup);
    console.log("selectedStaff ", selectedStaff);
    console.log("selectedSubject ", selectedSubject);
    console.log("authState role ", authState.role);
    console.log("authState course ", authState.course_name);
    console.log("selectedTypes ", selectedTypes);

    try {
      const response = await axios.post(
        // `http://localhost:7000/coordinator/assign-task`,
        `http://localhost:7000/coordinator/assign-task2`,
        {
          course_name: authState.course_name,
          subject_name: selectedSubject,
          group_name: selectedGroup,
          staff_name: selectedStaff,
          from_date: fromDate,
          till_date: tillDate,
          selected_types: selectedTypes, // Include selectedTypes in the request body
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Evaluation Added...");
      // Handle response as needed
    } catch (error) {
      console.error("Error assigning task:", error);
    }
  };

  const handleCheckboxChange = (type, isChecked) => {
    if (isChecked) {
      setSelectedTypes([...selectedTypes, type]);
    } else {
      setSelectedTypes(
        selectedTypes.filter((selectedType) => selectedType !== type)
      );
    }
  };

  return (
    <div className="container mt-4" style={{ width: "60%" }}>
      <h2 className="text-center mb-4">Course {authState.course_name} </h2>
      <Card className="p-4 shadow">
        <h3 className="text-center mb-4">Add Evaluation</h3>
        <Form>
          <Form.Group className="mb-3" controlId="subject">
            <Form.Label>Subject:</Form.Label>
            <Form.Select
              onChange={(e) => setSelectedSubject(e.target.value)}
              value={selectedSubject}
            >
              <option value="">Select a subject</option>
              {subjectOptions.map((subject, index) => (
                <option key={index} value={subject}>
                  {subject}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="group">
            <Form.Label>Group:</Form.Label>
            <Form.Select
              onChange={(e) => setSelectedGroup(e.target.value)}
              value={selectedGroup}
            >
              <option value="">Select a group</option>
              {groupNames.map((groupName, index) => (
                <option key={index} value={groupName}>
                  {groupName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="staff">
            <Form.Label>Staff Member:</Form.Label>
            <Form.Select
              onChange={(e) => setSelectedStaff(e.target.value)}
              value={selectedStaff}
            >
              <option value="">Select a staff member</option>
              {staffMembers.map((staffMember, index) => (
                <option key={index} value={staffMember}>
                  {staffMember}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <div className="semi-heading mb-3">Select Type:</div>
          <div className="checkboxes mb-3">
            <Form.Check
              type="checkbox"
              label="Theory"
              checked={selectedTypes.includes("Theory")}
              onChange={(e) => handleCheckboxChange("Theory", e.target.checked)}
            />
            <Form.Check
              type="checkbox"
              label="Lab"
              checked={selectedTypes.includes("Lab")}
              onChange={(e) => handleCheckboxChange("Lab", e.target.checked)}
            />
            <Form.Check
              type="checkbox"
              label="IA1"
              checked={selectedTypes.includes("IA1")}
              onChange={(e) => handleCheckboxChange("IA1", e.target.checked)}
            />
            <Form.Check
              type="checkbox"
              label="IA2"
              checked={selectedTypes.includes("IA2")}
              onChange={(e) => handleCheckboxChange("IA2", e.target.checked)}
            />
          </div>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="startDate">
              <Form.Label>Start Date:</Form.Label>
              <Form.Control
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col} controlId="tillDate">
              <Form.Label>Till Date:</Form.Label>
              <Form.Control
                type="date"
                value={tillDate}
                onChange={(e) => setTillDate(e.target.value)}
              />
            </Form.Group>
          </Row>

          <div className="text-center">
            <Button
              variant="primary"
              className="assign-task"
              style={{ width: "200px" }}
              onClick={handleAssignTask}
            >
              Assign Task
            </Button>
          </div>
        </Form>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddEvalUpdated;
