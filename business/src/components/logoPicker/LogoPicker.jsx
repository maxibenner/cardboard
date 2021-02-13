import React, { useState, useRef } from "react";
import styles from "./styles.module.css";
import { BsPlus } from "react-icons/bs";

function LogoPicker(props) {
    const [img, setImg] = useState();
    const inputRef = useRef();

    // Handle image
    const handleInput = () => {

        // Set preview image
        const imgObjectUrl = window.URL.createObjectURL(
            inputRef.current.files[0]
        );
        setImg(imgObjectUrl);

        // Pass value
        props.onChange(inputRef.current.files[0]);

    };
    return (
        <div className={styles.wrapper}>
            <p className={styles.text}>
                Logo<span>*</span>
            </p>
            <div className={styles.inputContainer}>
                {img && (
                    <div className={styles.imageContainer}>
                        {img && <img src={img} alt="logo" />}
                    </div>
                )}
                {!img && (
                    <label htmlFor="logoInput" className={styles.logoSelector}>
                        <BsPlus />
                    </label>
                )}
                <input
                    className={styles.hiddenInput}
                    id="logoInput"
                    ref={inputRef}
                    onChange={() => handleInput()}
                    type="file"
                />
            </div>
        </div>
    );
}

export default LogoPicker;
