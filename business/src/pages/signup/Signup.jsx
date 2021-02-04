import React from "react";
import SignupContainer from "../../containers/signupContainer/SignupContainer";
import styles from "./styles.module.css";

function Signup(props) {
  return (
    <div className={styles.wrapper} style={{ backgroundImage: "url(/media/bg.jpg)", backgroundSize: "cover" }}>
      <SignupContainer />
    </div>
  );
}

export default Signup;
