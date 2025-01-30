import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { AuthContext } from "./helpers/AuthContext";
import axios from "axios";
import NavBarBlue from "./components/NavBarBlue";
import PageNotFound from "./pages/PageNotFound";
import Home from "./pages/Home";
import StudentLogin from "./pages/Student/StudentLogin";
import StudentRegister from "./pages/Student/StudentRegister";
import StaffLogin from "./pages/Staff/StaffLogin";
import StaffRegister from "./pages/Staff/StaffRegister";
import RoleRestrictedRoute from "./pages/RoleRestricetdRoute";
import StudentHome from "./pages/Student/StudentHome";
import StaffHome from "./pages/Staff/StaffHome";
import CocoHome from "./pages/Coco/CocoHome";
import AdminHome from "./pages/Admin/AdminHome";
import ShowStudents from "./pages/Coco/ShowStudents";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import AddMarkScheme from "./pages/Coco/AddMarkScheme";
import AssignedTask from "./pages/Coco/AssignedTask";
import AddEvaluation from "./pages/Coco/AddEvaluation";
import PendingTasks from "./pages/Staff/PendingTasks";
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

    // Check if there is a valid access token before making the request
    if (token) {
      console.log(" App Access Token:", token);

      axios
        .get("http://localhost:7000/coordinator/auth", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("Auth Response:", response.data);

          if (response.data.error) {
            setAuthState({ ...authState, status: false });
          } else {
            const decodedToken = jwtDecode(token);
            setAuthState({
              name: decodedToken.staff_name,
              id: decodedToken.staff_id,
              status: true,
              role: decodedToken.role,
              course_name: decodedToken.course_name,
            });
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

            {/* //! STUDENT ROUTES */}
            <Route path="/student/login" exact component={StudentLogin} />
            <Route path="/student/register" exact component={StudentRegister} />
            <Route path="/student/home" exact component={StudentHome} />
            <Route
              path="/student/show-marks"
              exact
              component={StudentShowMarks}
            />

            {/* //! STAFF ROUTES */}
            <Route path="/staff/login" exact component={StaffLogin} />
            <Route path="/staff/register" exact component={StaffRegister} />
            <Route path="/staff/home" exact component={StaffHome} />
            <Route path="/staff/pending-task" exact component={PendingTasks} />

            {/* //! COCO ROUTES */}
            <Route path="/coco/home" exact component={CocoHome} />
            <Route path="/coco/show-students" exact component={ShowStudents} />
            <Route
              path="/coco/add-mark-scheme"
              exact
              component={AddMarkScheme}
            />
            <Route
              path="/coco/add-evaluation"
              exact
              component={AddEvaluation}
            />
            <Route path="/coco/assigned-task" exact component={AssignedTask} />

            {/* //! ADMIN ROUTES */}
            <RoleRestrictedRoute
              path="/admin/home"
              component={AdminHome}
              allowedRoles={["admin"]}
            />

            <Route path="*" exact component={PageNotFound} />
          </Switch>
        </Router>
      </AuthContext.Provider>
    </>
  );
};

export default App;
