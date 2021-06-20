import React from "react";
import Navbar from "../components/navbar";
import * as ROUTES from "../constants/routes";
import styles from "./landing.module.css";
import Image from "../media/landing_img.jpg";
import LoginContainer from "../containers/loginContainer/LoginContainer";

export default function Landing() {
    return (
        <div className={styles.wrapper}>
            <Navbar noauth relative transparent light to={ROUTES.LANDING} />
            <div className={styles.body}>
                <img src={Image} alt="family scene" className={styles.img} />
                <h3 className={styles.head}>
                    Cloud storage for <span>analog memories</span>
                </h3>
                <div className={styles.login}>
                    <LoginContainer />
                </div>
            </div>
            <div style={{height: "100px"}}/>
        </div>
    );
}
