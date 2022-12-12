import React, { useContext } from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Loading from "../components/loading/Loading";
import { userContext } from "../App";
import ProfileBody from "../components/Profilebody/body";

function Profile() {
  const contextArray = useContext(userContext);
  const user = contextArray[0];

  return <ProfileBody />;
}

export default withAuthenticationRequired(Profile, {
  onRedirecting: () => <Loading />,
});
