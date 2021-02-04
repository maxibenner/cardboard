import React from "react";
import { Link } from "react-router-dom";
import ButtonFilled from "../../components/buttonFilled/ButtonFilled";
import ButtonText from "../../components/linkText/LinkText";
import Input from "../../components/input/Input";
import styles from "./styles.module.css";

function LoginContainer(props) {
  return (
    <form className={styles.container}>
      <h1 className={styles.title}>Sign in</h1>
      <div style={{ marginBottom: "25px" }}>
        <Input grey type="email" label="Email" placeholder="Your email" />
        <Input
          grey
          type="password"
          label="Password"
          placeholder="Your password"
        />
      </div>
      <ButtonFilled textContent="Login" />
      <Link
        style={{ display: "flex", justifyContent: "center" }}
        to={"/signup"}
      >
        <ButtonText textContent="Create Account" />
      </Link>
    </form>
  );
}

export default LoginContainer;
