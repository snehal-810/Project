import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Card, Table } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../helpers/AuthContext";

const AssignedTask = () => {
  const [authState] = useContext(AuthContext);
  const [assignedTasks, setAssignedTasks] = useState([]);

  useEffect(() => {
    const fetchAssignedTasks = async () => {
      try {
        const response = await axios.get(
          // "http://localhost:7000/coordinator/show-assigned-task", //!OLD WORKING
          `http://localhost:7000/coordinator/show-unapproved-tasks/${authState.course_name}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response && response.data && response.data.data) {
          // Format date strings
          const formattedTasks = response.data.data.map((task) => ({
            ...task,
            from_date: formatDate(task.from_date),
            till_date: formatDate(task.till_date),
          }));
          setAssignedTasks(formattedTasks);
        } else {
          console.error("Invalid response");
        }
      } catch (error) {
        console.error("Error fetching assigned tasks:", error);
      }
    };

    fetchAssignedTasks();
  }, []);

  const handleApprovalChange = async (taskId, checked) => {
    console.log("taskId, checked", taskId, checked);

    try {
      await axios.put(
        `http://localhost:7000/coordinator/update-approval/${taskId}`,
        { approved: checked ? 1 : 0 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update the assignedTasks state to reflect the change in approval status
      setAssignedTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.entry_id === taskId) {
            if (task.approved == 1) {
              toast.warning("Task De-Approved...");
            } else {
              toast.success("Task Approved Successfully...");
            }

            return { ...task, approved: checked ? 1 : 0 };
          }
          return task;
        })
      );
    } catch (error) {
      console.error("Error updating approval status:", error);
    }
  };

  // Function to format date string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Course {authState.course_name}</h2>
      <Card className="p-4 shadow ">
        <h3 className="text-center mb-3">Assigned Tasks</h3>
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
              <th>Approved</th>
            </tr>
          </thead>
          <tbody>
            {assignedTasks.map((task, index) => (
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
                <td>
                  <input
                    type="checkbox"
                    checked={task.approved === 1}
                    onChange={(e) =>
                      handleApprovalChange(task.entry_id, e.target.checked)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AssignedTask;
