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
  width: "300px",
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
    axios.get(`${process.env.REACT_APP_BASE_URL}/posts`).then((res) => {
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
    axios.get(`${process.env.REACT_APP_BASE_URL}/posts`).then((res) => {
      setPosts(res.data.reverse());
    });
  }, []);

  const savePost = () => {
    handleClick();
    handleClose();

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/posts/add`, {
        userEmail: user.email,
        date: new Date().toISOString().slice(0, 10),
        body: postRef.current.value,
        comments: [],
        likes: 0,
      })
      .then(() => {
        axios.get(`${process.env.REACT_APP_BASE_URL}/posts`).then((res) => {
          setPosts(res.data.reverse());
        });
      });
  };

  navigator.geolocation.getCurrentPosition((position) => {
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&result_type=locality&key=AIzaSyDk7QukyH3p3FmHpeohuk7JbN51P5hHEiY`
      )
      .then((res) => {
        axios.put(`${process.env.REACT_APP_BASE_URL}/user/addlocation`, {
          email: user.email,
          city: res.data.results[0].address_components[0].long_name,
          state: res.data.results[0].address_components[2].long_name,
        });
        axios.post(`${process.env.REACT_APP_BASE_URL}/area/addarea`, {
          city: res.data.results[0].address_components[0].long_name,
          state: res.data.results[0].address_components[2].long_name,
        });
      });
  });

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
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
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
                  style={{ width: 250 }}
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
                {posts.map((post, index) => {
                  return (
                    <Post
                      refresh={refreshPosts}
                      key={index}
                      className={classes.post}
                      postInfo={post}
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
