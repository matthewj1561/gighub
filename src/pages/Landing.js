import { userContext } from "../App";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { Grid } from "@mui/material";

const Landing = () => {
  const contextArray = useContext(userContext);
  const isAuth = contextArray[2];
  const navigate = useNavigate();
  console.log(isAuth);
  if (isAuth) {
    navigate("/feed");
  }
  return (
    <React.Fragment>
      <Grid container justifyContent="center">
        <Grid item xs={6} md={3}>
          <h1>Welcome to Gighub!</h1>
          <p><strong>This website is currently under construction</strong></p>
          The purpose of this website is two fold.
          <ul>
            <li>My goal is to complete my senior project</li>
            <li>
              provide a place for gig workers to check up on current market
              demand, see what gig workers in their area are working on, and
              find out how to make the most money doing gig work in their area.
            </li>
          </ul>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
export default Landing;
