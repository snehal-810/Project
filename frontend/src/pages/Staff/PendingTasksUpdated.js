import React, { useContext, useEffect, useState } from "react";
import { Card, Table, Button } from "react-bootstrap";
import { AuthContext } from "../../helpers/AuthContext";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PendingTasks = () => {
  const [authState] = useContext(AuthContext);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [schemaMarks, setSchemaMarks] = useState({});

  useEffect(() => {
    const fetchUnapprovedTasks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/coordinator/show-unapproved-tasks2/${authState.course_name}`,
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
            type: JSON.parse(task.type)[0], // Parse type as string
          }));
          setAssignedTasks(formattedTasks);
        } else {
          console.error("Invalid response");
        }
      } catch (error) {
        console.error("Error fetching unapproved tasks:", error);
      }
    };

    const fetchSchemaMarks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/coordinator/show-schema?course_name=${authState.course_name}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response && response.data && response.data.data) {
          const marks = response.data.data[0];
          setSchemaMarks(marks);
        } else {
          console.error("Invalid response");
        }
      } catch (error) {
        console.error("Error fetching schema marks:", error);
      }
    };

    fetchUnapprovedTasks();
    fetchSchemaMarks();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const handleChange = (index, field, value) => {
    const updatedTasks = [...assignedTasks];
    updatedTasks[index][field] = value;
    setAssignedTasks(updatedTasks);
  };

  const toggleEditMode = (index) => {
    const updatedTasks = [...assignedTasks];
    updatedTasks[index].editMode = !updatedTasks[index].editMode;
    setAssignedTasks(updatedTasks);
  };

  const saveChanges = async (index) => {
    try {
      const task = assignedTasks[index];

      console.log("schemaMarks ", schemaMarks);

      // Validate marks
      const fieldValue = task[task.type.toLowerCase()]; // Get the field value based on the type

      if (
        fieldValue <= 0 ||
        fieldValue > schemaMarks[`${task.type.toLowerCase()}_weightage`]
      ) {
        toast.error(
          `Invalid marks entered for ${task.type}. It should be between 0 and ${
            schemaMarks[`${task.type.toLowerCase()}_weightage`]
          }`
        );
        return;
      }

      const response = await axios.put(
        `http://localhost:7000/coordinator/update-marks2/${task.entry_id}`,
        { field: task.type.toLowerCase(), value: fieldValue }, // Send the field and value to be updated
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response && response.data && response.data.status === "success") {
        setAssignedTasks((prevTasks) => {
          const updatedTasks = [...prevTasks];
          updatedTasks[index].approved = 1;
          updatedTasks[index].editMode = false;
          toast.success("Task Updated Successfully");
          return updatedTasks;
        });
      } else {
        console.error("Invalid response");
      }
    } catch (error) {
      console.error("Error updating approval status:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Course {authState.course_name}</h2>
      <Card className="p-4 shadow">
        <h3 className="text-center mb-3">Pending Tasks</h3>
        {assignedTasks.length === 0 ? (
          <Card.Text className="text-center">
            Currently no tasks assigned to you
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignedTasks.map((task, index) => (
                <tr key={index}>
                  <td>{task.staff_name}</td>
                  <td>{task.student_name}</td>
                  <td>{task.group_name}</td>
                  <td>{task.subject_name}</td>
                  <td>
                    {task.editMode && task.type === "Theory" ? (
                      <input
                        style={{ width: "40px" }}
                        type="text"
                        value={task.theory}
                        onChange={(e) =>
                          handleChange(index, "theory", e.target.value)
                        }
                        className="small-input"
                      />
                    ) : (
                      task.theory
                    )}
                  </td>
                  <td>
                    {task.editMode && task.type === "Lab" ? (
                      <input
                        style={{ width: "40px" }}
                        type="text"
                        value={task.lab}
                        onChange={(e) =>
                          handleChange(index, "lab", e.target.value)
                        }
                        className="small-input"
                      />
                    ) : (
                      task.lab
                    )}
                  </td>
                  <td>
                    {task.editMode && task.type === "IA1" ? (
                      <input
                        style={{ width: "40px" }}
                        type="text"
                        value={task.ia1}
                        onChange={(e) =>
                          handleChange(index, "ia1", e.target.value)
                        }
                        className="small-input"
                      />
                    ) : (
                      task.ia1
                    )}
                  </td>
                  <td>
                    {task.editMode && task.type === "IA2" ? (
                      <input
                        style={{ width: "40px" }}
                        type="text"
                        value={task.ia2}
                        onChange={(e) =>
                          handleChange(index, "ia2", e.target.value)
                        }
                        className="small-input"
                      />
                    ) : (
                      task.ia2
                    )}
                  </td>
                  <td>{task.from_date}</td>
                  <td>{task.till_date}</td>
                  <td>
                    {task.editMode ? (
                      <Button onClick={() => saveChanges(index)}>Save</Button>
                    ) : (
                      <Button onClick={() => toggleEditMode(index)}>
                        Edit
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default PendingTasks;
