import React from "react";
import styles from "./styles.module.css";

function Navbar(props) {
  return (
    <div className={styles.navbar}>
      <img className={styles.img} src="/logo.svg" alt="logo" />
      <div></div>
    </div>
  );
}

export default Navbar;
