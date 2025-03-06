import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import RoleSelection from "./RoleSelection.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import StudentDashboard from "./student/studentDashboard.jsx";
import Profile from "./pages/profile.jsx";
import ApplyGatePass from "./student/Applygatepass.jsx";
import Approvegatepass from "./Admin/Approvegatepass.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Admindashboard from "./Admin/Admindashboard.jsx";
import FineManagement from "./Admin/FineManagement.jsx";
import StudentFinePage from "./student/Fine.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/signup/:role" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Student Protected Routes */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Admindashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["student", "admin"]}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applygatepass"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <ApplyGatePass />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/approvegatepass"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Approvegatepass />
            </ProtectedRoute>
          }
        />
        <Route
          path="/imposefine"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <FineManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/getallfines/:student_id"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentFinePage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
