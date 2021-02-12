import React from "react";
import Menu from "../../components/menu/Menu";
import styles from "./styles.module.css";

import Input from "../../components/input/Input";
import LogoPicker from "../../components/logoPicker/LogoPicker";
import ThemePicker from "../../components/themePicker/ThemePicker";
import ButtonFilled from "../../components/buttonFilled/ButtonFilled";

function MyBusiness(props) {
    return (
        <div className={styles.wrapper}>
            <Menu />
            <div className={styles.container}>
                <h1 className={styles.title}>My Business</h1>
                <div className={styles.card}>
                    <h3>Info</h3>
                    <div className={styles.spacer} />
                    <Input
                        type="text"
                        placeholder="Name your business"
                        label="Business Name"
                        required
                    />
                </div>
                <div className={styles.card}>
                    <h3>Brand elements</h3>
                    <p className={styles.sub}>
                        Customise the look of the Cardboard customer platform.
                    </p>
                    <hr/>
                    <LogoPicker />
                    <ThemePicker />
                </div>
                <div className={styles.card}>
                    <h3>Domain</h3>
                </div>
                <div className={styles.buttonContainer}>
                    <ButtonFilled thin textContent="Save" />
                </div>
            </div>
        </div>
    );
}

export default MyBusiness;
