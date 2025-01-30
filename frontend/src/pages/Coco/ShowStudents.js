import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";

import { Button, Card, Form, Table } from "react-bootstrap";
import { AuthContext } from "../../helpers/AuthContext";

const ShowStudents = () => {
  const [authState] = useContext(AuthContext);
  const [courseName, setCourseName] = useState("DAC");
  const [groupName, setGroupName] = useState([]);
  const [studentsWithoutGroups, setStudentsWithoutGroups] = useState([]);
  const [studentsWithGroups, setStudentsWithGroups] = useState([]);
  const [refreshData, setRefreshData] = useState(false); // State variable to trigger data refresh

  useEffect(() => {
    console.log("SS token ", localStorage.getItem("token"));

    // Set courseName using authState.course_name
    setCourseName(authState.course_name);

    const fetchData = async () => {
      try {
        const groupResponse = await axios.post(
          `http://localhost:7000/coordinator/course-groups`,
          { course_name: courseName },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const groupNames = groupResponse.data.data.map(
          (group) => group.group_name
        );
        setGroupName(groupNames);

        const studentsWithoutGroupsResponse = await axios.get(
          `http://localhost:7000/coordinator/student-with-course?course_name=${courseName}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setStudentsWithoutGroups(studentsWithoutGroupsResponse.data.data);

        const studentsWithGroupsResponse = await axios.get(
          `http://localhost:7000/coordinator/student-with-course-groups?course_name=${courseName}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setStudentsWithGroups(studentsWithGroupsResponse.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [authState, courseName, refreshData]); // Add refreshData as a dependency

  const handleSave = (email, selectedGroup) => {
    axios
      .post(
        `http://localhost:7000/coordinator/add-student-group`,
        { email: email, group_name: selectedGroup },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((response) => {
        console.log(response.data);
        setRefreshData(!refreshData); // Toggle the refreshData state to trigger useEffect
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleEdit = () => {
    // Handle edit action
  };

  const handleGroupName = (index, selectedGroup) => {
    const updatedStudents = [...studentsWithoutGroups];
    updatedStudents[index].selectedGroup = selectedGroup;
    setStudentsWithoutGroups(updatedStudents);
  };

  return (
    <div className="container">
      <h1 className="text-center mb-4 mt-4">Course {courseName}</h1>
      <Card className="mt-4 p-4 shadow">
        <h2 className="text-center mb-4">Students without Groups</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Student Name</th>
              <th>Email</th>
              <th>Group Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {studentsWithoutGroups.map((student, index) => (
              <tr key={index}>
                <td>{student.roll_number}</td>
                <td>{student.student_name}</td>
                <td>{student.email}</td>
                <td>
                  <Form.Select
                    aria-label="Default select example"
                    value={student.selectedGroup}
                    onChange={(e) => handleGroupName(index, e.target.value)}
                  >
                    <option>-</option>
                    {groupName.map((group, groupIndex) => (
                      <option key={groupIndex} value={group}>
                        {group}
                      </option>
                    ))}
                  </Form.Select>
                </td>
                <td>
                  <Button variant="primary" onClick={handleEdit}>
                    Edit
                  </Button>{" "}
                  <Button
                    variant="success"
                    onClick={() =>
                      handleSave(student.email, student.selectedGroup)
                    }
                  >
                    Save
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <Card className="mt-4 p-4 shadow">
        <h2 className="text-center mb-4">Students with Groups</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Student Name</th>
              <th>Email</th>
              <th>Group Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {studentsWithGroups.map((student, index) => (
              <tr key={index}>
                <td>{student.roll_number}</td>
                <td>{student.student_name}</td>
                <td>{student.email}</td>
                <td>{student.group_name}</td>
                <td>
                  <Button variant="primary" onClick={handleEdit}>
                    Edit
                  </Button>{" "}
                  <Button variant="success" onClick={handleSave}>
                    Save
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};

export default ShowStudents;
