import React from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../components/loading/Loading";
import GigBody from "../components/GigBody/GigBody";

const Gig = () => {
  return <GigBody></GigBody>;
};
export default withAuthenticationRequired(Gig, {
  onRedirecting: () => <Loading />,
});
