import React, { useContext, useEffect, useState } from "react";
import { Card, Table, Button, ToastContainer } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../../helpers/AuthContext";

const ShowCompletedTasks = () => {
  const [authState] = useContext(AuthContext);
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    const fetchApprovedTasks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/coordinator/show-approved-tasks/${authState.course_name}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response && response.data && response.data.data) {
          const formattedTasks = response.data.data.map((task) => ({
            ...task,
            from_date: formatDate(task.from_date),
            till_date: formatDate(task.till_date),
            editMode: false,
          }));
          setCompletedTasks(formattedTasks);
        } else {
          console.error("Invalid response");
        }
      } catch (error) {
        console.error("Error fetching approved tasks:", error);
      }
    };

    fetchApprovedTasks();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Course {authState.course_name}</h2>
      <Card className="p-4 shadow">
        <h3 className="text-center mb-3">Completed Tasks</h3>
        {completedTasks.length === 0 ? (
          <Card.Text className="text-center">
            No completed tasks available
          </Card.Text>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Staff Name</th>
                <th>Student Name</th>
                <th>Group Name</th>
                <th>Subject Name</th>
                <th>Theory</th>
                <th>Lab</th>
                <th>IA1</th>
                <th>IA2</th>
                <th>From Date</th>
                <th>Till Date</th>
              </tr>
            </thead>
            <tbody>
              {completedTasks.map((task, index) => (
                <tr key={index}>
                  <td>{task.staff_name}</td>
                  <td>{task.student_name}</td>
                  <td>{task.group_name}</td>
                  <td>{task.subject_name}</td>
                  <td>{task.theory}</td>
                  <td>{task.lab}</td>
                  <td>{task.ia1}</td>
                  <td>{task.ia2}</td>
                  <td>{task.from_date}</td>
                  <td>{task.till_date}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default ShowCompletedTasks;
