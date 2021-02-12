import React from "react";
import styles from "./styles.module.css";
import { NavLink } from "react-router-dom";

function NavLinkIcon({ to, icon, text, disabled }) {
    return (
        <>
            {!disabled ? (
                <NavLink
                    to={to}
                    className={styles.container}
                    activeClassName={styles.active}
                    disabled
                >
                    <div>{icon}</div>
                    <p>{text}</p>
                </NavLink>
            ) : (
                <div className={`${styles.container} ${styles.disabled}`}>
                    <div>{icon}</div>
                    <p>{text}</p>
                </div>
            )}
        </>
    );
}

export default NavLinkIcon;
