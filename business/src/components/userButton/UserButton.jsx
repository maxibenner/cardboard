import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/Auth";
import styles from "./styles.module.css";
import { MdArrowDropDown } from "react-icons/md";

function UserButton(props) {
    const { user, token } = useContext(AuthContext);
    const [userName, setUserName] = useState();

    useEffect(() => {
        if (user) {
            const firstLetter = user.email.slice(0, 1).toUpperCase();
            const lastPart = user.email.slice(1).split("@")[0];
            setUserName(firstLetter + lastPart);
        }
    }, [user]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.txt}>{userName}</div>
            <MdArrowDropDown />
        </div>
    );
}

export default UserButton;
