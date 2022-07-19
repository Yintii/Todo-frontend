import './App.scss';
import React from 'react'
import { Navigate } from 'react-router-dom';
import { Routes, Route, Outlet } from "react-router-dom"
import { Home } from './components/Home';
import { Login } from './components/Login';
import { Logout } from './components/Logout';
import { Register } from './components/Register'

function App() {

  const PrivateRoute = ({ redirectPath = "/login", children }) => {
    if (localStorage.getItem("user") !== "false" && localStorage.getItem("user") !== null) {
      return children ? children : <Outlet />
    }
    return <Navigate to={redirectPath} replace />
  }


  return (
    <div className="App">
      <Routes>
        <Route element={<PrivateRoute />} >
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
