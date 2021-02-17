import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import firebase from "../../lib/firebase";
import ButtonFilled from "../../components/buttonFilled/ButtonFilled";
import Input from "../../components/input/Input";
import styles from "./styles.module.css";

function LoginContainer(props) {
  // Hooks
  let history = useHistory();

  // Track input values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((u) => {
        history.push("/dashboard");
      })
      .catch((error) => {
        window.alert(error.message);
      });
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className={styles.container}>
      <h1 className={styles.title}>Sign in</h1>
      <div style={{ marginBottom: "25px" }}>
        <Input
          grey
          onChange={(text) => setEmail(text)}
          type="email"
          label="Email"
          placeholder="Your email"
        />
        <Input
          grey
          onChange={(text) => setPassword(text)}
          type="password"
          label="Password"
          placeholder="Your password"
        />
      </div>
      <ButtonFilled bold textContent="Login" />
      <Link
        style={{ display: "flex", justifyContent: "center", marginTop: "15px", color: "var(--blue)"}}
        to={"/signup"}
      >Create Account
      </Link>
    </form>
  );
}

export default LoginContainer;
