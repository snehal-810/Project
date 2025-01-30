import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Card, Table } from "react-bootstrap";
import { AuthContext } from "../../helpers/AuthContext";

const StudentShowMarks = () => {
  const [authState] = useContext(AuthContext);
  const [approvedTasks, setApprovedTasks] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status
  console.log("authState ", authState);

  useEffect(() => {
    const fetchApprovedTasks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/student/show-student-mark/${authState.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response && response.data && response.data.data) {
          setApprovedTasks(response.data.data);
        } else {
          console.error("Invalid response");
        }
        setLoading(false); // Set loading to false after fetching data
      } catch (error) {
        console.error("Error fetching approved tasks:", error);
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchApprovedTasks();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Show Marks</h2>
      <Card className="p-4 shadow">
        {loading ? (
          <Card.Text>Loading...</Card.Text>
        ) : approvedTasks.length === 0 ? ( // Check if there are no approved tasks
          <Card.Text>No marks to show</Card.Text>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Group Name</th>
                <th>Subject Name</th>
                <th>Theory</th>
                <th>Lab</th>
                <th>IA1</th>
                <th>IA2</th>
              </tr>
            </thead>
            <tbody>
              {approvedTasks
                .filter((task) => task.approved === 1)
                .map((task, index) => (
                  <tr key={index}>
                    <td>{task.student_name}</td>
                    <td>{task.group_name}</td>
                    <td>{task.subject_name}</td>
                    <td>{task.theory}</td>
                    <td>{task.lab}</td>
                    <td>{task.ia1}</td>
                    <td>{task.ia2}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default StudentShowMarks;
