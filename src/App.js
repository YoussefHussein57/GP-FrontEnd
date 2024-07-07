import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import ManageUsers from "./pages/ManageUsers/ManageUsers";
import UnderConstruction from "./pages/Inventory/UnderConstruction";
import UnderConstruction1 from "./pages/Notification/UnderConstruction";
import UnderConstruction2 from "./pages/Settings/UnderConstruction";
import "./App.css";
import Searchbar from "./components/Searchbar/Searchbar";

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Router>
      <Main
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
      />
    </Router>
  );
};

const Main = ({ email, password, setEmail, setPassword }) => {
  const location = useLocation();
  const hideSidebarRoutes = ["/login"];
  const hideSearchbarRoutes = ["/login"];

  return (
    <div className="flex w-full h-screen">
      {!hideSidebarRoutes.includes(location.pathname) && (
        <Sidebar email={email} password={password} />
      )}
      <div className="bg-background w-full flex flex-col ">
        <div>
          {!hideSearchbarRoutes.includes(location.pathname) && <Searchbar />}
        </div>
        <Routes>
          <Route
            path="/login"
            element={<Login setEmail={setEmail} setPassword={setPassword} />}
          />
          <Route path="/home" element={<Home />} />
          <Route
            path="/dashboard"
            element={<Dashboard email={email} password={password} />}
          />
          <Route path="/admin" element={<ManageUsers />} />
          <Route path="/Inventory" element={<UnderConstruction />} />
          <Route path="/Notification" element={<UnderConstruction1 />} />
          <Route path="/Settings" element={<UnderConstruction2 />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
