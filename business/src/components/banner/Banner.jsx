import React from "react";
import styles from "./styles.module.css";
import { MdInfo } from "react-icons/md";

function Banner(props) {
    return (
        <>
            <div className={`${styles.container} ${styles.floating}`}>
                <div>
                    <div>
                        <MdInfo />
                    </div>
                    <p>
                        Before we get you started, please set up your company
                        profile.
                    </p>
                </div>
            </div>
            <div className={styles.container}>
                <div>
                    <div>
                        <MdInfo />
                    </div>
                    <p>
                        Before we get you started, please set up your company
                        profile.
                    </p>
                </div>
            </div>
        </>
    );
}

export default Banner;
