import { userContext } from "../App";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import LandingImage from "../images/landing.png"
import classes from "./Landing.module.css";
import { Grid } from "@mui/material";

const Landing = () => {
  const contextArray = useContext(userContext);
  const isAuth = contextArray[2];
  const navigate = useNavigate();
  if (isAuth) {
    navigate("/feed");
  }
  return (
    <React.Fragment>
      <div className={classes.landingPage}>

      </div>
    </React.Fragment>
  );
};
export default Landing;
