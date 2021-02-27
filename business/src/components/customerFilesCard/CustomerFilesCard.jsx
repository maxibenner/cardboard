import React from "react";
import styles from "./customerFilesCard.module.css";
import { timestamp_to_date, prettier_size } from "../../helpers/tools";
import SpinnerSmallGrey from "../spinnerSmallGrey/SpinnerSmallGrey";

const CustomerFilesCard = ({ file }) => {
    return (
        <div className={styles.card}>
            <div className={styles.thumbnail_container}>
                {file.thumbnail_url !== undefined ? (
                    <img src={file.thumbnail_url} alt="thumbnail" />
                ) : (
                    <div
                        style={{
                            display: "flex",
                            width: "100%",
                            height: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <SpinnerSmallGrey />
                    </div>
                )}
            </div>
            <p className={styles.name}>{file.name}</p>
            <p className={styles.size}>{prettier_size(file.size / 1000000)}</p>
            <p className={styles.date}>{timestamp_to_date(file.creation_time)}</p>
        </div>
    );
};

export default CustomerFilesCard;
