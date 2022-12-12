import React from "react";
import AreaBody from "../components/AreaBody/AreaBody";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../components/loading/Loading";

const Area = () => {
  return <AreaBody></AreaBody>;
};
export default withAuthenticationRequired(Area, {
  onRedirecting: () => <Loading />,
});
