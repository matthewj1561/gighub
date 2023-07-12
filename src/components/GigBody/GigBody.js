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
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Grid } from "@mui/material";
import classes from "./GigBody.module.css";
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

function GigBody() {
  const postRef = useRef();
  const [ToastOpen, setToastOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const contextArray = useContext(userContext);
  const user = contextArray[0];

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    wage: "",
    requiredSkills: "",
    contactInfo: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const refreshPosts = () => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/gigposts`).then((res) => {
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
    axios.get(`${process.env.REACT_APP_BASE_URL}/gigposts`).then((res) => {
      setPosts(res.data.reverse());
    });
  }, []);

  const savePost = () => {
    handleClick();
    handleClose();

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/gigposts/add`, {
        userEmail: user.email,
        date: new Date().toISOString().slice(0, 10),
        title: formData.title,
        description: formData.description,
        wage: formData.wage,
        requiredSkills: formData.requiredSkills,
        contactInfo: formData.contactInfo,
        comments: [],
        likes: 0,
      })
      .then(() => {
        axios.get(`${process.env.REACT_APP_BASE_URL}/gigposts`).then((res) => {
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
              Your Gig Posting
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  multiline
                  label="Title"
                  id="my-input"
                  fullWidth
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextareaAutosize
                  required
                  id="body"
                  minRows={8}
                  placeholder="Description"
                  style={{ width: "98%" }}
                  fullwidth="true"
                  variant="standard"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  inputRef={null}
                  multiline
                  label="Wage"
                  id="my-input"
                  fullWidth
                  name="wage"
                  value={formData.wage}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  inputRef={null}
                  multiline
                  label="Required Skills"
                  id="my-input"
                  fullWidth
                  name="requiredSkills"
                  value={formData.requiredSkills}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  inputRef={null}
                  multiline
                  label="Contact Info (email or phone)"
                  id="my-input"
                  fullWidth
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleInputChange}
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
          <Grid item sm={0} md={2}></Grid>
          <Grid item sm={12} md={8}>
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
          <Grid item sm={0} md={2}></Grid>
        </Grid>
      </div>
    </React.Fragment>
  );
}

export default GigBody;
