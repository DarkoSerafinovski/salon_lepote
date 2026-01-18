import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddEmployee from "./pages/AddEmployee";
import Navbar from "./components/NavBar";
import { useState } from "react";
import CreateService from "./pages/CreateService";
import ServicesList from "./pages/ServicesList";
import EditService from "./pages/EditService";
import ServiceRequests from "./pages/ServiceRequests";
import EmployeesList from "./pages/EmployeesList";
import WeeklySchedule from "./pages/WeeklySchedule";
import EmployeeSchedule from "./pages/EmployeeSchedule";
import ClientBookings from "./pages/ClientBookings";
import EmployeeDailySchedule from "./pages/EmployeeDailySchedule";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!sessionStorage.getItem("token"),
  );

  const checkAuth = () => {
    setIsAuthenticated(!!sessionStorage.getItem("token"));
  };
  return (
    <Router>
      <div>
        <main>
          {isAuthenticated && (
            <Navbar onLogout={() => setIsAuthenticated(false)} />
          )}
          <Routes>
            <Route path="/" element={<Login onLoginSuccess={checkAuth} />} />
            <Route
              path="/register"
              element={<Register onRegisterSuccess={checkAuth} />}
            />
            <Route path="/add-employee" element={<AddEmployee />} />

            <Route path="/services" element={<ServicesList />} />
            <Route path="/create-service" element={<CreateService />} />
            <Route path="/services/edit" element={<EditService />} />
            <Route path="/service-requests" element={<ServiceRequests />} />
            <Route path="/employees" element={<EmployeesList />} />
            <Route path="/schedule" element={<WeeklySchedule />} />
            <Route path="/employee-schedule" element={<EmployeeSchedule />} />
            <Route path="/my-bookings" element={<ClientBookings />} />
            <Route
              path="/my-daily-schedule"
              element={<EmployeeDailySchedule />}
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
