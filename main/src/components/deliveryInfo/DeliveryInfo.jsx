import React, { useState } from "react";
import styles from "./deliveryInfo.module.css";
import { MdWarning } from "react-icons/md";
import ButtonFilled from "../../components/buttonFilled/ButtonFilled";

function DeliveryInfo(props) {
    const [daysLeft, setDaysLeft] = useState(90);
    const [requiredStorage, setRequiredStorage] = useState("7MB");

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <MdWarning
                    style={{ margin: "1rem 40px 0 0", fontSize: "4rem" }}
                />
                <div className={styles.body}>
                    <h3 className={styles.head}>
                        This folder is only accessible for{" "}
                        <span>{daysLeft}</span> days.
                    </h3>
                    <p>
                        Please do either of the following to access your files
                        in the future:
                    </p>
                    <div className={styles.list}>
                        <p>
                            {`Download all files to a harddrive with at least ${requiredStorage}
                            of free storage space.`}
                        </p>
                        <p>
                            <ButtonFilled
                                thin
                                textContent="Sign up"
                                style={{
                                    width: "100px",
                                    marginRight: "7px",
                                    flexShrink: 0,
                                    display: "inline-block",
                                }}
                                onClick={props.onClick}
                            />
                            for Cardboard to keep your files in the cloud
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeliveryInfo;
