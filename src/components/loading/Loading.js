import React from "react";
import ReactLoading from "react-loading";
import classes from "./Loading.module.css";

const Loading = ({ type, color }) => (
  <div className={classes.loading}>
    <ReactLoading type={type} color={"black"} height={"20%"} width={"20%"} />
  </div>
);

export default Loading;
