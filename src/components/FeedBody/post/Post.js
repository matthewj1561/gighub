import classes from "./Post.module.css";
import { Button, Grid } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import Comment from "./comment/comment";
import { IconButton } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUpOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import React, { useRef, useContext, useState, useEffect } from "react";
import { Snackbar, TextField } from "@mui/material";
import { userContext } from "../../../App";

function Post(props) {
  //get the global user context
  const contextArray = useContext(userContext);
  const user = contextArray[0];

  // Refs and other variables
  const feedbackMessage = "Saved!";
  const commentBody = useRef();

  // States
  const [ToastOpen, setToastOpen] = React.useState(false);
  const [userInfo, setUserInfo] = useState({
    given_name: "",
    family_name: "",
    picture: "",
    email: "",
  });

  // Functions
  const handleToastClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setToastOpen(false);
  };

  // Toast action
  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleToastClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  // Toast handler
  const handleClick = () => {
    setToastOpen(true);
  };

  // on mounting get the poster's info
  useEffect(() => {
    axios.get(`https://gighubapi.herokuapp.com/user?email=${user.email}`).then((res) => {
      setUserInfo(res.data);
    });
  }, []);

  const saveComment = () => {
    if (commentBody.current.value != "") {
      handleClick();
      axios
        .put(`https://gighubapi.herokuapp.com/posts/addcomment`, {
          postId: props.postinfo._id,
          userEmail: user.email,
          date: new Date().toISOString().slice(0, 10),
          body: commentBody.current.value,
        })
        .then(() => {
          props.refresh();
          commentBody.current.value = "";
        });
    }
  };

  const saveLike = () => {
    axios
      .put(`https://gighubapi.herokuapp.com/posts/addlike`, {
        postId: props.postinfo._id,
      })
      .then(() => {
        props.refresh();
      });
  };

  return (
    <div className={classes.mainPost}>
      <div>
        <Snackbar
          open={ToastOpen}
          autoHideDuration={4000}
          onClose={handleToastClose}
          message={feedbackMessage}
          action={action}
        />
        <Grid container>
          <Grid item s={2}>
            <Avatar
              src={userInfo.picture}
              alt={userInfo.email}
              sx={{ margin: 0 }}
            />
          </Grid>
          <Grid item sx={{ padding: 1 }} s={2}>
            <span>
              {userInfo.given_name} {userInfo.family_name}
            </span>
          </Grid>
          <Grid item sx={{ padding: 1 }} s={12}>
            <span className={classes.date}>{props.postinfo.date}</span>
          </Grid>
        </Grid>
        <Grid container>
          <Grid xs={12} sx={{ textAlign: "left", padding: 2 }} item>
            <p>{props.postinfo.body}</p>
            {/* <p>{props.postinfo._id}</p> */}
          </Grid>
          <Grid item>
            <ThumbUpIcon sx={{ height: 15, color: "blue" }} />
            {props.postinfo.likes}
          </Grid>
        </Grid>
      </div>
      <hr />
      <Grid container>
        <Grid xs={6} item>
          <Button onClick={saveLike} className={classes.icon}>
            <ThumbUpIcon sx={{ height: 30 }} />
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button className={classes.icon}>
            <h4 className={classes.comments}>Comments</h4>
          </Button>
        </Grid>
      </Grid>
      <hr />
      <Grid container>
        <Grid item xs={12} sx={{ padding: 1 }}>
          {props.postinfo.comments.map((comment, index) => {
            return <Comment key={index} commentinfo={comment}></Comment>;
          })}
        </Grid>
      </Grid>
      <Grid container>
        <Grid item sx={{ padding: 1, position: "relative" }} xs={12}>
          <TextField
            inputRef={commentBody}
            multiline
            label={"Say Something!"}
            id="my-input"
            fullWidth
          />
          <button
            onClick={saveComment}
            className={[classes.icon, classes.sendButton].join(" ")}
          >
            <SendOutlinedIcon />
          </button>
        </Grid>
      </Grid>
    </div>
  );
}

export default Post;
