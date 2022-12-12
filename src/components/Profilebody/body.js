import React, { useRef, useContext, useEffect, useState } from "react";
import { userContext } from "../../App";
import { Grid, Box, TextField, Button } from "@mui/material";
import classes from "./body.module.css";
import axios from "axios";

function ProfileBody() {
  const contextArray = useContext(userContext);
  const user = contextArray[0];
  const firstNameRef = useRef();
  const lastNameRef = useRef();

  let [userInfo, setUserInfo] = useState({
    given_name: "",
    family_name: "",
    picture: "",
    email: "",
    city: "",
    state: ""
  });

  const saveName = () => {
    const firstN = firstNameRef.current.value;
    const lastN = lastNameRef.current.value;

    axios
      .put(`https://gighubapi.herokuapp.com/user/addname`, {
        email: user.email,
        first: firstN,
        last: lastN,
      })
      .then(() => {
        axios
          .get(`https://gighubapi.herokuapp.com/user?email=${user.email}`)
          .then((res) => {
            setUserInfo(res.data);
          });
      });
  };

  // const saveLocation = () => {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     axios
  //       .get(
  //         `http://api.positionstack.com/v1/reverse?access_key=99f6359f2b3e62fbe2747ee9c25c5b8f&query=${position.coords.latitude}, ${position.coords.longitude}`
  //       )
  //       .then((res) => {
  //         console.log(res.data.data[0]);
  //       });
  //   });
  // };

  useEffect(() => {
    axios.get(`https://gighubapi.herokuapp.com/user?email=${user.email}`).then((res) => {
      setUserInfo(res.data);
    });
  }, []);

  return (
    <React.Fragment>
      <Box sx={{ flexGrow: 1, padding: 2 }}></Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {userInfo.picture ? (
            <img
              className={classes.profileImg}
              src={userInfo.picture}
              alt={userInfo.given_name}
            />
          ) : (
            <img
              className={classes.profileImg}
              src={user.picture}
              alt={userInfo.given_name}
            />
          )}
        </Grid>
        <Grid item xs={12}>
          {userInfo.given_name ? (
            <h1>{`${userInfo.given_name} ${userInfo.family_name}`}</h1>
          ) : (
            <Box>
              <TextField
                inputRef={firstNameRef}
                sx={{ margin: 1 }}
                id="outlined-basic"
                label="First Name"
                variant="outlined"
                value={userInfo.given_name ? userInfo.given_name : null}
              />
              <TextField
                inputRef={lastNameRef}
                sx={{ margin: 1 }}
                id="outlined-basic"
                label="Last Name"
                variant="outlined"
                value={userInfo.family_name ? userInfo.family_name : null}
              />
              <Button onClick={saveName}>Save Name</Button>
            </Box>
          )}
        </Grid>
        <Grid item xs={12}>
          <h3>{userInfo.email}</h3>
        </Grid>
        <Grid item xs={12}>
          {`${userInfo.city}, ${userInfo.state}`}
        </Grid>
      </Grid>
      <Box></Box>
    </React.Fragment>
  );
}

export default ProfileBody;
