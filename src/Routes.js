import { BrowserRouter as Route, Router, Routes } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./dashboard/Dashboard";
import Register from "./Register";
import NomatchPage from "./NomatchPage";

const Routes = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="" element={<NomatchPage />} />
        </Routes>
      </Router>
    </>
  );
};

export default Routes;
