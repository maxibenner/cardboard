import React from "react";
import styles from "./styles.module.css";
import { NavLink } from "react-router-dom";

function NavLinkIcon({ to, icon, text }) {
  return (
    <NavLink
      to={to}
      className={styles.container}
      activeClassName={styles.active}
    >
      <div>{icon}</div>
      <p>{text}</p>
    </NavLink>
  );
}

export default NavLinkIcon;
