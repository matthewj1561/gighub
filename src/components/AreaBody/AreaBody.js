import React, { useContext, useState } from "react";
import { useEffect, useRef } from "react";
import { userContext } from "../../App";
import axios from "axios";
import {
  RadioGroup,
  IconButton,
  Snackbar,
  Modal,
  Box,
  Typography,
  Grid,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  TextField,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CancelIcon from "@mui/icons-material/Cancel";
import classes from "./AreaBody.module.css";
import ChartCom from "./ChartCom/ChartCom";

function AreaBody() {
  // Init user info variables and gain context
  let question = null;
  let [questionCounter, setQuestionCounter] = useState(0);
  const contextArray = useContext(userContext);
  const user = contextArray[0];
  const [userInfo, setUserInfo] = useState({
    given_name: "",
    family_name: "",
    picture: "",
    email: "",
    city: "",
    state: "",
  });
  const [payInfo, setPayInfo] = useState({
    eightFifty: 1,
    tenToFifteen: 1,
    fifteenToTwenty: 1,
    twentyToThirty: 1,
    thirtyPlus: 1,
  });
  const [expensesInfo, setExpensesInfo] = useState({
    lessThanTwenty: 0,
    TwentytoSixty: 0,
    sixtyToOneTwenty: 0,
    OneTwentyToTwoFifty: 0,
    TwoFiftyPlus: 0,
  });
  const [demandInfo, setDemandInfo] = useState({
    morning: 0,
    noon: 0,
    afternoon: 0,
    evening: 0,
    night: 0,
  });
  const [hotSpots, setHotSpots] = useState([]);
  const [savedTips, setSavedTips] = useState([]);

  // Get the current user info
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/user?email=${user?.email}`)
      .then((res1) => {
        setUserInfo(res1.data);

        axios
          .get(
            `${process.env.REACT_APP_BASE_URL}/area/getonearea?city=${res1.data.city}&state=${res1.data.state}`
          )
          .then((res) => {
            setPayInfo(res.data.areaData.pay);
            setExpensesInfo(res.data.areaData.expenses);
            setDemandInfo(res.data.areaData.demand);
            setHotSpots(res.data.areaData.hotSpots);
            setSavedTips(res.data.areaData.Tips);
          });
      });
  }, []);

  //Pop up form
  const modalStyles = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 250,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    minHeight: "38%",
  };

  const [ToastOpen, setToastOpen] = useState(false);
  const [errorToastOpen, setErrorToastOpen] = useState(false);

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setQuestionCounter(questionCounter + 1);

    setOpen(true);
  };

  const handleClose = () => {
    setQuestionCounter(0);
    setOpen(false);
  };

  const handleToastClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setToastOpen(false);
  };
  const handleErrorToastClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorToastOpen(false);
  };

  const [pay, setPay] = useState(null);
  const [cost, setCost] = useState(null);
  const [hotspotValues, setHotspotValues] = useState([]);
  const [demand, setDemand] = useState(null);
  const [tips, setTips] = useState("");

  // Adds new hotspot item, in switch 3
  const inputRef = useRef();
  const handleAddField = (e) => {
    const values = [...hotspotValues];
    if (inputRef.current.value != "") {
      let value = inputRef.current.value;
      values.push(value);
      setHotspotValues(values);
      inputRef.current.value = "";
    }
  };
  // Deletes hotpsot item, in switch 3
  const deleteItem = (event) => {
    let values = [...hotspotValues];
    let removingIndex = values.indexOf(event);
    values = values.splice(removingIndex, 1);
    setHotspotValues(values);
  };

  const handleSurveySubmission = () => {
    let submissionObject = {
      city: userInfo.city,
      state: userInfo.state,
      pay: pay,
      cost: cost,
      hotspotValues: hotspotValues,
      demand: demand,
      tips: tips,
    };
    for (let field in submissionObject) {
      if (submissionObject[field] == null) {
        if (field != "tips") {
          setErrorToastOpen(true);
          return;
        }
      }
    }
    //Close the modal and send confirmation message
    handleClose();
    setToastOpen(true);

    //Reset the form
    setPay(null);
    setCost(null);
    setHotspotValues([]);
    setDemand(null);
    setTips("");

    axios.put(
      `${process.env.REACT_APP_BASE_URL}/area/postsurvey`,
      submissionObject
    );
  };

  //This switch statement determines the JSX that will be injected
  //into the survey modal
  switch (questionCounter) {
    // Wages
    case 1:
      question = (
        <React.Fragment>
          <Typography>
            On average, how much money do you make per hour doing Gig work?
          </Typography>
          <hr />
          <RadioGroup
            row
            aria-labelledby="demo-radio-buttons-group-label"
            value={pay}
            onChange={(e) => setPay(e.target.value)}
            name="radio-buttons-group=1"
          >
            <FormControlLabel
              value="eightFifty"
              control={<Radio />}
              label="< $8.50"
            />
            <FormControlLabel
              value="tenToFifteen"
              control={<Radio />}
              label="$10-$15"
            />
            <FormControlLabel
              value="fifteenToTwenty"
              control={<Radio />}
              label="$15-$20"
            />
            <FormControlLabel
              value="twentyToThirty"
              control={<Radio />}
              label="$20-$30"
            />
            <FormControlLabel
              value="thirtyPlus"
              control={<Radio />}
              label="$30+"
            />
          </RadioGroup>
        </React.Fragment>
      );
      break;
    // Expenses
    case 2:
      question = (
        <React.Fragment>
          <Typography>
            On average, how much money goes towards running your gig each week?
            (Your expenses)
          </Typography>
          <hr />
          <RadioGroup
            value={cost}
            row
            aria-labelledby="demo-radio-buttons-group-label"
            // value={pay}
            onChange={(e) => setCost(e.target.value)}
            name="radio-buttons-group-2"
          >
            <FormControlLabel
              value="lessThanTwenty"
              control={<Radio />}
              label="< 20"
            />
            <FormControlLabel
              value="TwentytoSixty"
              control={<Radio />}
              label="20-60"
            />
            <FormControlLabel
              value="sixtyToOneTwenty"
              control={<Radio />}
              label="60-120"
            />
            <FormControlLabel
              value="OneTwentyToTwoFifty"
              control={<Radio />}
              label="120-250"
            />
            <FormControlLabel
              value="TwoFiftyPlus"
              control={<Radio />}
              label="250+"
            />
          </RadioGroup>
        </React.Fragment>
      );
      break;
    // Hotspots
    case 3:
      question = (
        <React.Fragment>
          <Typography>
            Are there any hotspots in your town where orders seem to come more
            often?
          </Typography>
          <hr />
          {hotspotValues?.map((v, i) => {
            return (
              <Grid
                key={i}
                sx={{ backgroundColor: "rgb(184, 204, 255)", padding: "5px" }}
                container
              >
                <Grid item xs={6}>
                  <Typography
                    sx={{
                      fontSize: 20,
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {v}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <IconButton
                    onClick={() => {
                      let values = [...hotspotValues];
                      let removingIndex = values.indexOf(v);
                      if (removingIndex == 0) {
                        values.shift();
                        setHotspotValues(values);
                      } else {
                        values.splice(removingIndex, 1);
                        setHotspotValues(values);
                      }
                    }}
                  >
                    <CancelIcon />
                  </IconButton>
                </Grid>
              </Grid>
            );
          })}
          {
            <div className={classes.newHotspot}>
              <TextField
                sx={{ margin: "10px" }}
                type="text"
                placeholder="Hotspot"
                inputRef={inputRef}
              />
              <Button
                sx={{ marginTop: "20px" }}
                className="add-btn"
                onClick={handleAddField}
              >
                Add new
              </Button>
            </div>
          }
        </React.Fragment>
      );
      break;
    // Busy Time
    case 4:
      question = (
        <React.Fragment>
          <Typography>What time of the day is most busy?</Typography>
          <hr />
          <RadioGroup
            row
            aria-labelledby="demo-radio-buttons-group-label"
            value={demand}
            onChange={(e) => setDemand(e.target.value)}
            name="radio-buttons-group=1"
          >
            <FormControlLabel
              value="morning"
              control={<Radio />}
              label="Morning"
            />
            <FormControlLabel value="noon" control={<Radio />} label="Noon" />
            <FormControlLabel
              value="afternoon"
              control={<Radio />}
              label="Afternoon"
            />
            <FormControlLabel
              value="evening"
              control={<Radio />}
              label="Evening"
            />
            <FormControlLabel value="night" control={<Radio />} label="Night" />
          </RadioGroup>
        </React.Fragment>
      );
      break;
    // Tips
    case 5:
      question = (
        <React.Fragment>
          <Typography>
            Do you have any tips or tricks you've found to be useful in this
            area? (This is an optional field)
          </Typography>
          <hr />
          <TextField
            value={tips}
            onChange={(e) => {
              setTips(e.target.value);
            }}
            id="outlined-textarea"
            label="Tips"
            placeholder="Placeholder"
            multiline
            variant="outlined"
            sx={{ width: "100%" }}
          />
          <Button onClick={handleSurveySubmission}>Submit Survey</Button>
        </React.Fragment>
      );
      break;
  }

  return userInfo.city && userInfo.state ? (
    <React.Fragment>
      <h1>{`Stats for: ${userInfo.city}, ${userInfo.state} `}</h1>
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
          Thank you for your input!
        </Alert>
      </Snackbar>
      <Snackbar
        open={errorToastOpen}
        autoHideDuration={6000}
        onClose={handleErrorToastClose}
      >
        <Alert
          elevation={6}
          variant="filled"
          sx={{ width: "100%" }}
          onClose={handleErrorToastClose}
          severity="error"
        >
          Please fill in all fields.
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
            Local Gig Economy Survey
          </Typography>
          <Typography variant="h5">{`Question ${questionCounter} / 5`}</Typography>
          <Grid container spacing={3}>
            <Grid item sx={{ marginBottom: "40px" }} xs={12} sm={12}>
              {question}
            </Grid>
            <Grid item sx={{ position: "absolute", bottom: "10%" }} xs={6}>
              <Button
                disabled={questionCounter == 1 ? true : false}
                onClick={() => {
                  setQuestionCounter(questionCounter - 1);
                }}
              >
                Previous
              </Button>
            </Grid>

            <Grid
              item
              sx={{
                position: "absolute",
                bottom: "10%",
                right: "10%",
              }}
              xs={6}
            >
              <Button
                disabled={questionCounter == 5 ? true : false}
                onClick={() => {
                  setQuestionCounter(questionCounter + 1);
                }}
              >
                Next
              </Button>
            </Grid>
            {/* <Grid item xs={12} sm={12}>
              <Button variant="contained">Submit</Button>
            </Grid> */}
          </Grid>
        </Box>
      </Modal>
      <Button
        sx={{ display: "flex", alignSelf: "flex-start", margin: "20px" }}
        onClick={handleOpen}
        variant="contained"
      >
        Complete Survey
      </Button>
      <Grid
        container
        rowSpacing={6}
        alignItems="center"
        justifyContent="center"
      >
        {/* Hourly Pay */}
        <Grid item xs={12} sm={6} md={4}>
          <h1>Hourly Pay</h1>
          <ChartCom
            labels={["<$8.50", "$10-$15", "$15-$20", "$20-$30", "$30+"]}
            data={payInfo}
            colors={[
              "rgb(66, 245, 245)",
              "rgb(66, 212, 245)",
              "rgb(66, 182, 245)",
              "rgb(66, 141, 245)",
              "rgb(32, 90, 171)",
            ]}
            borderColor={"rgb(0, 217, 255)"}
          />
        </Grid>
        {/* Expenses */}
        <Grid item xs={12} sm={6} md={4}>
          <h1>Weekly Expenses</h1>
          <ChartCom
            labels={["<$20", "$20-$60", "$60-$120", "$120-$250", "$250+"]}
            data={expensesInfo}
            colors={[
              "rgb(32, 171, 132)",
              "rgb(113, 240, 204)",
              "rgb(40, 250, 166)",
              "rgb(120, 250, 198)",
              "rgb(0, 179, 107)",
            ]}
            borderColor={"rgb(28, 140, 95)"}
          />
        </Grid>
        {/* Demand */}
        <Grid item xs={12} sm={6} md={4}>
          <h1>Daily Demand</h1>
          <ChartCom
            labels={["Morning", "Noon", "Afternoon", "Evening", "Night"]}
            data={demandInfo}
            colors={[
              "rgb(32, 171, 132)",
              "rgb(113, 240, 204)",
              "rgb(40, 250, 166)",
              "rgb(120, 250, 198)",
              "rgb(0, 179, 107)",
            ]}
            borderColor={"rgb(28, 140, 95)"}
          />
        </Grid>
        {/* Hot Spots */}
        <Grid item lg={6} sm={12} md={6} xs={12} xl={6}>
          <h1>Hot Spots</h1>
          <ul className={classes.tipList}>
            {hotSpots?.map((hotspot) => {
              return <li>{hotspot}</li>;
            })}
          </ul>
        </Grid>
        {/* Git Tips */}
        <Grid item sm={12} xs={12} md={6} lg={6} xl={6}>
          <h1>Gig Tips</h1>
          <ul className={classes.tipList}>
            {savedTips?.map((tip) => {
              return <li>{tip}</li>;
            })}
          </ul>
        </Grid>
      </Grid>
    </React.Fragment>
  ) : (
    <h1>Error retrieving user location</h1>
  );
}

export default AreaBody;
