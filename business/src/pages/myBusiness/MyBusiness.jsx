import React, { useState } from "react";
import Menu from "../../components/menu/Menu";
import styles from "./styles.module.css";

import Input from "../../components/input/Input";
import LogoPicker from "../../components/logoPicker/LogoPicker";
import ThemePicker from "../../components/themePicker/ThemePicker";
import ButtonFilled from "../../components/buttonFilled/ButtonFilled";

function MyBusiness(props) {
    const [bizName, setBizName] = useState(null);
    const [logo, setLogo] = useState(null);
    const [color, setColor] = useState(null);

    // Data changes
    const handleBizNameChange = (value) => {
        value === "" ? setBizName(null) : setBizName(value);
    };
    const handleLogoChange = (value) => {
        setLogo(value);
    };
    const handleColorChange = (value) => {
        /^([0-9A-F]{3}){1,2}$/i.test(value) ? setColor(value) : setColor(null)
    };

    // Submit
    const handleSubmit = () => {
        console.log(bizName, logo, color);
        if (bizName && logo && color) {
            console.log("allowed");
        }
    };

    return (
        <div className={styles.wrapper}>
            <Menu />
            <div className={styles.container}>
                <h1 className={styles.title}>My Business</h1>
                <div className={styles.card}>
                    <h3>Info</h3>
                    <div className={styles.spacer} />
                    <Input
                        grey
                        type="text"
                        placeholder="Name your business"
                        label="Business Name"
                        required
                        onChange={(value) => handleBizNameChange(value)}
                    />
                </div>
                <div className={styles.card}>
                    <h3>Brand elements</h3>
                    <p className={styles.sub}>
                        Customise the look of the Cardboard customer platform.
                    </p>
                    <hr />
                    <LogoPicker onChange={(value) => handleLogoChange(value)} />
                    <ThemePicker
                        onChange={(value) => handleColorChange(value)}
                    />
                </div>
                <div className={styles.card}>
                    <h3>Domain</h3>
                    <p style={{fontWeight:500}}>Default</p>
                    <p>{`www.${bizName ? bizName.toLowerCase()+"." : ""}cardboard.video`}</p>
                </div>
                <div className={styles.buttonContainer}>
                    <ButtonFilled
                        onClick={handleSubmit}
                        thin
                        textContent="Save"
                    />
                </div>
            </div>
        </div>
    );
}

export default MyBusiness;
