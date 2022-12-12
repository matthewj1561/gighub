import React, { useRef, useState, useContext, useEffect } from "react";
import {
  Button,
  Modal,
  Box,
  Typography,
  TextareaAutosize,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Grid } from "@mui/material";
import classes from "./FeedBody.module.css";
import Post from "./post/Post";
import axios from "axios";
import { userContext } from "../../App";

const modalStyles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function FeedBody() {
  const postRef = useRef();
  const [ToastOpen, setToastOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const contextArray = useContext(userContext);
  const user = contextArray[0];

  const refreshPosts = () => {
    axios.get("http://localhost:5000/posts").then((res) => {
      setPosts(res.data.reverse());
    });
  };

  const handleClick = () => {
    setToastOpen(true);
  };

  const handleToastClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setToastOpen(false);
  };

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

  useEffect(() => {
    axios.get("http://localhost:5000/posts").then((res) => {
      setPosts(res.data.reverse());
    });
  }, []);

  const savePost = () => {
    handleClick();
    handleClose();

    axios
      .post(`http://localhost:5000/posts/add`, {
        userEmail: user.email,
        date: new Date().toISOString().slice(0, 10),
        body: postRef.current.value,
        comments: [],
        likes: 0,
      })
      .then(() => {
        axios.get("http://localhost:5000/posts").then((res) => {
          setPosts(res.data.reverse());
        });
      });
  };

  return (
    <React.Fragment>
      <div className={classes.mainContents}>
        <Snackbar
          open={ToastOpen}
          autoHideDuration={6000}
          onClose={handleToastClose}
        >
          <Alert
            elevation={6}
            variant="filled"
            sx={{ width: "100%" }}
            onClose={handleToastClose}
            severity="success"
          >
            Posted!
          </Alert>
        </Snackbar>
        
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyles}>
            <Typography variant="h6" gutterBottom>
              Your Post
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12}>
                <TextareaAutosize
                  ref={postRef}
                  autoFocus
                  required
                  id="body"
                  name="body"
                  minRows={8}
                  placeholder="What do you want to say?"
                  style={{ width: 400 }}
                  fullwidth="true"
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Button onClick={savePost} variant="contained">
                  Post
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Modal>
        <Grid container>
          <Grid item sm={0} md={3}></Grid>
          <Grid item sm={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Button onClick={handleOpen} variant="contained">
                  New Post
                </Button>
              </Grid>
              <Grid item xs={12}>
                {console.log(posts)}
                {posts.map((post, index) => {
                  // console.log(posts);
                  return (
                    <Post
                      refresh={refreshPosts}
                      key={index}
                      className={classes.post}
                      postinfo={post}
                    ></Post>
                  );
                })}
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={0} md={3}></Grid>
        </Grid>
      </div>
    </React.Fragment>
  );
}

export default FeedBody;
