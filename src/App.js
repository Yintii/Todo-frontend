import './App.css';
import React, { useEffect, useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom';
import JWT from 'jsonwebtoken'
import { Home } from './components/Home';
import { Login } from './components/Login';
import { Routes, Route, Outlet } from "react-router-dom"
import { Logout } from './components/Logout';
import env from "react-dotenv";

function App() {

  const [user, setUser] = useState(null)

  const PrivateRoute = (user, { redirectPath = "/login", children }) => {
    console.log("USER: ", user);
    if (user.user !== "false" && user.user !== null) {
      let authedUser = JWT.verify(user.user, env.SECRET);
      if (authedUser) {
        return children ? children : <Outlet />
      }
    }
    return <Navigate to={redirectPath} replace />

  }

  return (
    <div className="App">
      <Routes>
        <Route element={<PrivateRoute user={user} />} >
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/logout" element={<Logout />} />

      </Routes>
    </div>
  );
}

export default App;
