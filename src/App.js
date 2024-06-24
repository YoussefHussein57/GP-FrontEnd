// src/App.js
import React from "react";
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
// import Notification from "./pages/Notification/Notification";
// import Inventory from "./pages/Inventory/Inventory";
// import Settings from "./pages/Settings/Settings";
import "./App.css";
import Searchbar from "./components/Searchbar/Searchbar";

const App = () => {
  return (
    <Router>
      <Main />
    </Router>
  );
};

const Main = () => {
  const location = useLocation();
  const hideSidebarRoutes = ["/login"];
  const hideSearchbarRoutes = ["/login"];

  return (
    <div className="App">
      {!hideSidebarRoutes.includes(location.pathname) && <Sidebar />}
   
      <div className="content">
      <div className="SearchBar">
      {!hideSearchbarRoutes.includes(location.pathname) && <Searchbar/>}
      </div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/notification" element={<Notification />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/settings" element={<Settings />} /> */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
