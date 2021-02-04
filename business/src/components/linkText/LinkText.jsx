import React from "react";
import styles from "./styles.module.css";

function LinkText(props) {
  return (
    <div onClick={props.onClick} className={styles.button}>
      {props.textContent}
    </div>
  );
}

export default LinkText;
