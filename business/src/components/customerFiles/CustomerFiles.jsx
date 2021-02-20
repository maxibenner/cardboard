import React from "react";
import styles from "./customerFiles.module.css";
import ButtonGhost from "../buttonGhost/ButtonGhost";
import ButtonFilled from "../buttonFilled/ButtonFilled";
import CustomerFilesCard from "../../components/customerFilesCard/CustomerFilesCard";
import SpinnerSmallGrey from "../../components/spinnerSmallGrey/SpinnerSmallGrey";

function CustomerFiles({ files }) {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.thumbnail}>{""}</h3>
                <h3 className={styles.name}>Filename</h3>
                <h3 className={styles.size}>Size</h3>
                <h3 className={styles.date}>Uploaded</h3>
            </div>
            <div className={styles.filesContainer}>
                {!files ? (
                    <>
                        {files === undefined ? (
                            <SpinnerSmallGrey
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                }}
                            />
                        ) : (
                            <div className={styles.noFiles}>No files</div>
                        )}
                    </>
                ) : (
                    files.map((file) => {
                        return (
                            <CustomerFilesCard file={file} key={file.created} />
                        );
                    })
                )}
            </div>
            <div style={{ width: "fit-content", margin: "15px 0 0 auto" }}>
                <ButtonGhost
                    style={{ width: "200px" }}
                    textContent="Add files"
                />
                <ButtonFilled
                    textContent="Start timer"
                    style={{ width: "200px", marginLeft: "10px" }}
                />
            </div>
        </div>
    );
}

export default CustomerFiles;
