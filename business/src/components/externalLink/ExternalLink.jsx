import React from "react";
import styles from "./externalLink.module.css";
import {IoMdArrowDropright} from "react-icons/io";

function ExternalLink(props) {
    return (
        <a target="_empty" href={props.href} className={styles.container}>
            <p>{props.textContent}</p>
            <IoMdArrowDropright />
        </a>
    );
}

export default ExternalLink;
