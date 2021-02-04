import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ButtonFilled from "../../components/buttonFilled/ButtonFilled";
import LinkText from "../../components/linkText/LinkText";
import Input from "../../components/input/Input";
import styles from "./styles.module.css";
import { firebase } from "../../lib/firebase";

function SignupContainer(props) {
  //Activate submit button
  const [active, setActive] = useState(true);

  // Track input statuses
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [company, setCompany] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((u) => {
        console.log(u);
      })
      .catch((error) => {
        if(error.code === "auth/email-already-in-use"){
          console.log("attaching to existing user")
        }
      });
  };

  //Update active
  useEffect(() => {
    if (
      firstName === undefined ||
      firstName === "" ||
      lastName === undefined ||
      lastName === "" ||
      company === undefined ||
      company === "" ||
      email === undefined ||
      email === "" ||
      password === undefined ||
      password === ""
    ) {
      setActive(false);
    } else {
      setActive(true);
    }
  }, [firstName, lastName, company, email, password]);

  return (
    <form onSubmit={(e) => handleSubmit(e)} className={styles.container}>
      <h1 className={styles.title}>Create Account</h1>
      <div style={{ marginBottom: "25px" }}>
        <div style={{ display: "flex" }}>
          <Input
            grey
            onChange={(text) => setFirstName(text)}
            required
            type="text"
            label="First Name"
            placeholder="First Name"
          />
          <div style={{ width: "10px" }} />
          <Input
            grey
            onChange={(text) => setLastName(text)}
            required
            type="text"
            label="Last Name"
            placeholder="Last Name"
          />
        </div>
        <Input
          grey
          onChange={(text) => setCompany(text)}
          required
          type="text"
          label="Company Name"
          placeholder="Company Name"
        />
        <Input
          grey
          onChange={(text) => setEmail(text)}
          required
          type="email"
          label="Business Email"
          placeholder="Business Email"
        />
        <Input
          grey
          onChange={(text) => setPassword(text)}
          required
          type="password"
          label="Password"
          placeholder="Your Password"
        />
      </div>
      <ButtonFilled
        disabled={active ? false : true}
        textContent="Create Account"
      />
      <Link style={{ display: "flex", justifyContent: "center" }} to={"/"}>
        <LinkText textContent="Sign in" />
      </Link>
    </form>
  );
}

export default SignupContainer;
