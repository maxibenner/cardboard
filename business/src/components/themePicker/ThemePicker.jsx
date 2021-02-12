import React, { useRef, useState } from "react";
import styles from "./styles.module.css";

function ThemePicker(props) {
    const [color, setColor] = useState("2d7af2");
    const inputRef = useRef();
    //Handle color change
    const handleInput = () => {
        setColor(inputRef.current.value);
    };
    return (
        <div className={styles.wrapper}>
            <p className={styles.text}>
                Theme Color<span>*</span>
            </p>
            <div className={styles.container}>
                <div
                    className={styles.color}
                    style={{
                        background: `#${color}`,
                    }}
                />
                <div className={styles.containerInner}>
                    <p>#</p>
                    <input
                        minLength="3"
                        maxLength="6"
                        onChange={() => handleInput()}
                        type="text"
                        ref={inputRef}
                        className={styles.hexInput}
                        placeholder="2d7af2"
                    />
                </div>
            </div>
        </div>
    );
}

export default ThemePicker;
