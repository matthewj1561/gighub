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

  useEffect(() => {
    console.log(user);
    axios.post(`${process.env.REACT_APP_BASE_URL}/user/adduser`, {
      ...user,
    });

    navigator.geolocation.getCurrentPosition((position) => {
      axios
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&result_type=locality&key=AIzaSyDk7QukyH3p3FmHpeohuk7JbN51P5hHEiY`
        )
        .then((res) => {
          axios.put(`${process.env.REACT_APP_BASE_URL}/user/addlocation`, {
            email: user?.email,
            city: res.data.results[0].address_components[0].long_name,
            state: res.data.results[0].address_components[2].long_name,
          });
          axios.post(`${process.env.REACT_APP_BASE_URL}/area/addarea`, {
            city: res.data.results[0].address_components[0].long_name,
            state: res.data.results[0].address_components[2].long_name,
          });
        });
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
