import React from "react";
import LoginContainer from "../../containers/loginContainer/LoginContainer";
import styles from "./styles.module.css";

function login(props) {
  return (
    <div className={styles.wrapper} /*style={{ backgroundImage: "url(/media/bg.jpg)", backgroundSize: "cover" }}*/>
      <LoginContainer />
    </div>
  );
}

export default login;
