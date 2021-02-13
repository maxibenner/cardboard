import React, { useRef, useState } from "react";
import styles from "./styles.module.css";
import { BsQuestion } from "react-icons/bs";

function ThemePicker(props) {
    const [color, setColor] = useState("2d7af2");
    const inputRef = useRef();
    //Handle color change
    const handleInput = () => {
        // Change visual
        /^([0-9A-F]{3}){1,2}$/i.test(inputRef.current.value)
            ? setColor(inputRef.current.value)
            : setColor(null);

        // Pass value
        props.onChange(inputRef.current.value);
    };
    return (
        <div className={styles.wrapper}>
            <p className={styles.text}>
                Theme Color<span>*</span>
            </p>
            <div className={styles.container}>
                {color ? (
                    <div
                        className={styles.color}
                        style={{
                            background: `#${color}`,
                        }}
                    />
                ) : (
                    <div className={styles.noColor}>
                        <BsQuestion />
                    </div>
                )}

                <div className={styles.containerInner}>
                    <p>#</p>
                    <input
                        autoCorrect="false"
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
