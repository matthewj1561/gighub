import React from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../components/loading/Loading";

const Gig = () => {
  return <div>Gig is working!</div>;
};
export default withAuthenticationRequired(Gig, {
  onRedirecting: () => <Loading />,
});
