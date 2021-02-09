import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/Auth";
import styles from "./styles.module.css";

function UserButton(props) {
    const currentUser = useContext(AuthContext);
    const [userName, setUserName] = useState();

    useEffect(() => {
        if (currentUser) {
            const firstLetter = currentUser.email.slice(0, 1).toUpperCase();
            const lastPart = currentUser.email.slice(1).split("@")[0];
            setUserName(firstLetter + lastPart);
        }
    }, [currentUser]);

    return <div className={styles.wrapper}>{userName}</div>;
}

export default UserButton;
