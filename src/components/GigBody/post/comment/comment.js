import classes from "./comment.module.css";
import { Avatar, Grid } from "@mui/material";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

function Comment(props) {
  // Get the commenter's information after
  // the component renders
  let [commenter, setCommenter] = useState({
    given_name: "",
    family_name: "",
    picture: "",
    email: "",
  });
  useEffect(() => {
    //`http://localhost:5000/user?email=${user.email}`
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/user?email=${props.commentinfo.userEmail}`
      )
      .then((res) => {
        setCommenter(res.data);
      });
  }, []);

  return (
    <div className={classes.mainComment}>
      <Grid container spacing={1}>
        <Grid item s={2}>
          <Avatar src={commenter.picture}></Avatar>
        </Grid>
        <Grid item>
          <p>
            {commenter.given_name} {commenter.family_name}
          </p>
        </Grid>

        <Grid item xs={12} sx={{ textAlign: "left" }}>
          {props.commentinfo.body}
        </Grid>
      </Grid>
    </div>
  );
}

export default Comment;
