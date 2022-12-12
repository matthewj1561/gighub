import Header from "./Header";
import { Button } from "@mui/material";
import { useContext } from "react";
import { userContext } from "../../App";

function Layout(props) {
  const contextArray = useContext(userContext);

  let userButton = null;
  if (!contextArray[2]) {
    userButton = (
      <Button variant="contained" onClick={contextArray[1]}>
        Log In
      </Button>
    );

    // userButton = (
    //   <Button
    //     onClick={() => props.logoutFunc({ returnTo: window.location.origin })}
    //     variant="contained"
    //   >
    //     Log out
    //   </Button>
    // );
  }

  return (
    <main>
      <Header btn={userButton} />
      {props.children}
    </main>
  );
  /* <MainNavigation className={classes.nav} /> */
}

export default Layout;
