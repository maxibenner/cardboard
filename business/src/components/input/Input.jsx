import React from "react";
import styles from "./styles.module.css";

function Input(props) {
    // Pass input value
    const handleChange = (e) => {
        props.onChange(e.target.value);
    };

    return (
        <div className={styles.container}>
            <input
                autoCorrect="false"
                onChange={handleChange}
                required={props.required && true}
                type={props.type}
                className={`${styles.input} ${props.grey && styles.grey}`}
                placeholder={props.placeholder}
            />
            <div className={styles.labelContainer}>
                <p>{props.label}</p>
                {props.required && (
                    <p className={styles.requiredIndicator}>*</p>
                )}
            </div>
        </div>
    );
}

export default Input;
