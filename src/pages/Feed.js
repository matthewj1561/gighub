import React from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../components/loading/Loading";
import FeedBody from "../components/FeedBody/FeedBody";

const Feed = () => {
  return <FeedBody />;
};
export default withAuthenticationRequired(Feed, {
  onRedirecting: () => <Loading />,
});
