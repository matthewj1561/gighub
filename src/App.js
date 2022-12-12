import logo from "./logo.svg";
import axios from "axios";
import React, { createContext } from "react";
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

export const userContext = createContext();

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const { logout } = useAuth0();
  const { loginWithRedirect } = useAuth0();
  let city = null;
  let state = null;

  navigator.geolocation.getCurrentPosition((position) => {
    axios
      .get(
        `http://api.positionstack.com/v1/reverse?access_key=99f6359f2b3e62fbe2747ee9c25c5b8f&query=${position.coords.latitude}, ${position.coords.longitude}`
      )
      .then((res) => {
        axios
        .put(`http://localhost:5000/user/addlocation`, {
          email: user.email,
          city: res.data.data[0].locality,
          state: res.data.data[0].region
        });
        axios
        .post(`http://localhost:5000/area/addarea`,{
            city: res.data.data[0].locality,
            state: res.data.data[0].region
          })
          
          
        
        // console.log(res.data.data[0].region);
      });
  });

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
