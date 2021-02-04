import React from "react";
import styles from "./styles.module.css";

function ButtonFilled(props) {
  return (
    <button disabled={props.disabled && true} className={styles.button}>
      {props.textContent}
    </button>
  );
}

export default ButtonFilled;
