import logo from "./logo.svg";
import React, { createContext, useEffect } from "react";
import "./App.css";
import Layout from "./components/layout/Layout";
import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import Profile from "./pages/Profile";
import Loading from "./components/loading/Loading";
import Area from "./pages/Area";
import Feed from "./pages/Feed";
import Gig from "./pages/Gig";
import axios from "axios";
// https://gighubapi.herokuapp.com
// https://gighub-back.onrender.com
// http://localhost:5000
export const userContext = createContext();

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const { logout } = useAuth0();
  const { loginWithRedirect } = useAuth0();
  let city = null;
  let state = null;

  useEffect(() => {
    console.log(user);
    axios.post(`${process.env.REACT_APP_BASE_URL}/user/adduser`, {
      ...user,
    });
  }, [user]);

  return (
    <userContext.Provider
      value={[user, loginWithRedirect, isAuthenticated, logout]}
    >
      <Layout
      // loginFunc={loginWithRedirect}
      // isLoggedIn={isAuthenticated}
      // logoutFunc={logout}
      // user={user}
      >
        <Routes>
          <Route path="/" element={<Landing />}></Route>
          <Route path="/profile" element={<Profile />} />
          <Route path="/area" element={<Area />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/gig" element={<Gig />} />
        </Routes>
      </Layout>
    </userContext.Provider>
  );
}

export default App;
