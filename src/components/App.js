import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Container } from "react-bootstrap";
import Login from "./auth/Login";
import EmployeeList from "./employee/List";

const App = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleUpdate = () => {
    setSelectedEmployee(null);
  };

  return (
    <Container>
      <h1 className="text-center my-4">Employee Management</h1>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </Container>
  );
};

export default App;
