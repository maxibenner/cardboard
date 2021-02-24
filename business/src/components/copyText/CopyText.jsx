import React from "react";
import styles from "./copyText.module.css";
import { FiCopy } from "react-icons/fi";

function CopyText({ text }) {
    const handleCopy = () => {
        navigator.clipboard.writeText(text).then(
            () => window.alert("Link has been copied to clipboard"),
            () =>
                window.alert(
                    "Your browser doesn't support automatically copying to clipboard. Please manually select the link to share it."
                )
        );
    };

    return (
        <div className={styles.container} style={{ maxWidth: "300px" }}>
            <p className={styles.text}>{text}</p>
            <div className={styles.iconContainer} onClick={handleCopy}>
                <FiCopy />
            </div>
        </div>
    );
}

export default CopyText;
