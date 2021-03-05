import React, { useState } from "react";
import styles from "./deliveryInfo.module.css";
import { MdWarning } from "react-icons/md";
import ButtonFilled from "../../components/buttonFilled/ButtonFilled";
import { prettier_size } from "../../helpers/tools";

function DeliveryInfo({ fileSize, onClick }) {
    const [daysLeft, setDaysLeft] = useState(90);

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
                            {`Download all files to a harddrive with at least ${prettier_size(
                                fileSize
                            )}
                            of free disk space.`}
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
                                onClick={onClick}
                            />
                            for Cardboard to keep your files savely in the cloud.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeliveryInfo;
