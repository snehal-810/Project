import React, { useState, useEffect } from "react";
import axios from "axios";

const ShowAssignedTask = () => {
  const [assignedTasks, setAssignedTasks] = useState([]);

  useEffect(() => {
    const fetchAssignedTasks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:7000/coordinator/show-assigned-task",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response && response.data && response.data.data) {
          setAssignedTasks(response.data.data);
        } else {
          console.error("Invalid response");
        }
      } catch (error) {
        console.error("Error fetching assigned tasks:", error);
      }
    };

    fetchAssignedTasks();
  }, []);

  return (
    <div>
      <h2>Show Assigned Tasks</h2>
      <table>
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Subject Name</th>
            <th>Staff Name</th>
            <th>Group Name</th>
            <th>From Date</th>
            <th>Till Date</th>
            <th>Student Name</th>
            <th>Theory</th>
            <th>Lab</th>
            <th>IA1</th>
            <th>IA2</th>
            <th>Approved</th>
          </tr>
        </thead>
        <tbody>
          {assignedTasks.map((task, index) => (
            <tr key={index}>
              <td>{task.course_name}</td>
              <td>{task.subject_name}</td>
              <td>{task.staff_name}</td>
              <td>{task.group_name}</td>
              <td>{task.from_date}</td>
              <td>{task.till_date}</td>
              <td>{task.student_name}</td>
              <td>{task.theory}</td>
              <td>{task.lab}</td>
              <td>{task.ia1}</td>
              <td>{task.ia2}</td>
              <td>{task.approved}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShowAssignedTask;
