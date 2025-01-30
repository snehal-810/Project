import axios from "axios";
import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import NavBarBlue from "./components/NavBarBlue";
import { AuthContext } from "./helpers/AuthContext";
import AdminHome from "./pages/Admin/AdminHome";
import CocoHome from "./pages/Coco/CocoHome";
import ShowStudents from "./pages/Coco/ShowStudents";
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";
import StaffHome from "./pages/Staff/StaffHome";
import StaffLogin from "./pages/Staff/StaffLogin";
import StaffRegister from "./pages/Staff/StaffRegister";
import StudentHome from "./pages/Student/StudentHome";
import StudentLogin from "./pages/Student/StudentLogin";
import StudentRegister from "./pages/Student/StudentRegister";

import { jwtDecode } from "jwt-decode";
import ProtectedRoute from "./components/ProtectedRoute";
import ShowAllCourses from "./pages/Admin/ShowAllCourses";
import ShowAllGroups from "./pages/Admin/ShowAllGroups";
import ShowAllStaffs from "./pages/Admin/ShowAllStaffs";
import ShowAllStudents from "./pages/Admin/ShowAllStudents";
import AddEvalUpdated from "./pages/Coco/AddEvalUpdated";
import AddEvaluation from "./pages/Coco/AddEvaluation";
import AddMarkScheme from "./pages/Coco/AddMarkScheme";
import AssignTaskUpdated from "./pages/Coco/AssignTaskUpdated";
import AssignedTask from "./pages/Coco/AssignedTask";
import ShowCompletedTasks from "./pages/Coco/ShowCompletedTasks";
import CompletedTasks from "./pages/Staff/CompletedTasks";
import PendingTasks from "./pages/Staff/PendingTasks";
import PendingTasksUpdated from "./pages/Staff/PendingTasksUpdated";
import StudentShowMarks from "./pages/Student/StudentShowMarks";

const App = () => {
  // const [courseName, setCourseName] = useState("DAC");
  const [authState, setAuthState] = useState({
    name: "",
    id: 0,
    status: false,
    role: "",
    course_name: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    // console.log("App2 token ", token);

    // Check if there is a valid access token before making the request
    if (token) {
      console.log("App Token after login:", token);

      axios
        .get("http://localhost:7000/coordinator/auth", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          //   console.log("Auth Response:", response.data);

          if (response.data.error) {
            setAuthState({ ...authState, status: false });
          } else {
            const decodedToken = jwtDecode(token);
            const { role } = decodedToken;
            // console.log("DT role", role);
            if (role === "student") {
              setAuthState({
                id: decodedToken.student_id,
                name: decodedToken.student_name,
                role,
                status: true,
              });
            } else if (role === "admin") {
              setAuthState({
                name: decodedToken.staff_name,
                id: decodedToken.staff_id,
                status: true,
                role: decodedToken.role,
                course_name: "",
              });
            } else {
              setAuthState({
                name: decodedToken.staff_name,
                id: decodedToken.staff_id,
                status: true,
                role: decodedToken.role,
                course_name: decodedToken.course_name,
              });
            }
          }
        })
        .catch((error) => {
          console.error("Auth Request Error:", error);
          // Handle error as needed
        });
    } else {
      // No valid access token, handle as needed (e.g., redirect to login)
      console.log("No valid access token found");
    }
  }, []);

  console.log("App authState ", authState);

  return (
    <>
      <AuthContext.Provider value={[authState, setAuthState]}>
        <Router>
          <NavBarBlue />

          <Switch>
            <Route path="/" exact component={Home} />
            {/* Other routes */}

            {/* STUDENT ROUTES */}
            <Route path="/student/login" exact component={StudentLogin} />
            <Route path="/student/register" exact component={StudentRegister} />
            <ProtectedRoute
              path="/student/home"
              component={StudentHome}
              allowedRoles={["student"]}
              authState={authState}
            />
            <ProtectedRoute
              path="/student/show-marks"
              component={StudentShowMarks}
              allowedRoles={["student"]}
              authState={authState}
            />

            {/* STAFF ROUTES */}
            <Route path="/staff/login" exact component={StaffLogin} />
            <Route path="/staff/register" exact component={StaffRegister} />
            <ProtectedRoute
              path="/staff/home"
              component={StaffHome}
              allowedRoles={["staff"]}
              authState={authState}
            />
            <ProtectedRoute
              path="/staff/pending-task"
              component={PendingTasks}
              allowedRoles={["staff"]}
              authState={authState}
            />
            <ProtectedRoute
              path="/staff/completed-tasks"
              component={CompletedTasks}
              allowedRoles={["staff"]}
              authState={authState}
            />

            {/* COCO ROUTES */}
            <ProtectedRoute
              path="/coco/home"
              component={CocoHome}
              allowedRoles={["coordinator"]}
              authState={authState}
            />
            <ProtectedRoute
              path="/coco/show-students"
              component={ShowStudents}
              allowedRoles={["coordinator"]}
              authState={authState}
            />
            <ProtectedRoute
              path="/coco/add-mark-scheme"
              component={AddMarkScheme}
              allowedRoles={["coordinator"]}
              authState={authState}
            />
            <ProtectedRoute
              path="/coco/add-evaluation"
              component={AddEvaluation}
              allowedRoles={["coordinator"]}
              authState={authState}
            />
            <ProtectedRoute
              path="/coco/assigned-task"
              component={AssignedTask}
              allowedRoles={["coordinator"]}
              authState={authState}
            />
            <ProtectedRoute
              path="/coco/show-completed-tasks"
              component={ShowCompletedTasks}
              allowedRoles={["coordinator"]}
              authState={authState}
            />
            {/* Other COCO routes */}

            {/* ADMIN ROUTES */}
            <ProtectedRoute
              path="/admin/home"
              component={AdminHome}
              allowedRoles={["admin"]}
              authState={authState}
            />
            <ProtectedRoute
              path="/admin/show-all-students"
              component={ShowAllStudents}
              allowedRoles={["admin"]}
              authState={authState}
            />
            <ProtectedRoute
              path="/admin/show-all-staffs"
              component={ShowAllStaffs}
              allowedRoles={["admin"]}
              authState={authState}
            />
            <ProtectedRoute
              path="/admin/show-all-courses"
              component={ShowAllCourses}
              allowedRoles={["admin"]}
              authState={authState}
            />
            <ProtectedRoute
              path="/admin/show-all-groups"
              component={ShowAllGroups}
              allowedRoles={["admin"]}
              authState={authState}
            />
            {/* //! TEST: ADDEVALUPDATED */}
            <ProtectedRoute
              path="/coco/add-evaluation2"
              component={AddEvalUpdated}
              allowedRoles={["coordinator"]}
              authState={authState}
            />
            <ProtectedRoute
              path="/coco/assign-task2"
              component={AssignTaskUpdated}
              allowedRoles={["coordinator"]}
              authState={authState}
            />
            <ProtectedRoute
              path="/staff/pending-task2"
              component={PendingTasksUpdated}
              allowedRoles={["staff"]}
              authState={authState}
            />

            {/* Page not found */}
            <Route path="*" exact component={PageNotFound} />
          </Switch>
        </Router>
      </AuthContext.Provider>
    </>
  );
};

export default App;
