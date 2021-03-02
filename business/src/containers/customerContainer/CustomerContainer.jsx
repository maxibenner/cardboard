import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import ReactDom from "react-dom";
import { MdClose } from "react-icons/md";
import ButtonFilled from "../../components/buttonFilled/ButtonFilled";
import CopyText from "../../components/copyText/CopyText";
import CustomerFiles from "../../components/customerFiles/CustomerFiles";
import Divider from "../../components/divider/Divider";
import Tag from "../../components/tag/Tag";
import { prettier_size, timestamp_to_date } from "../../helpers/tools";
import firebase from "../../lib/firebase";
import styles from "./customerContainer.module.css";

function CustomerContainer({ userRecord, handleClose }) {
    // files
    const [files, setFiles] = useState(undefined);
    const [storage, setStorage] = useState(0);
    const [daysTillDel, setDaysTillDel] = useState(90);
    const [timerActive, setTimerActive] = useState(false);

    // Handle timer toggle
    const toggleTimer = () => {
        const confirm = window.confirm(
            `This will send a notification to ${userRecord.email}. Are you sure you want to ${
                timerActive ? "stop" : "start"
            } the countdown timer?`
        );
        if (confirm) setTimerActive((state) => !state);
    };

    // Get customer files
    useEffect(() => {
        // Get user id
        const uid = userRecord.uid;

        // Get firestore doc
        const listener = firebase
            .firestore()
            .collection("users")
            .doc(uid)
            .collection("files")
            .where("business", "==", "lalaland")
            .onSnapshot((collection) => {
                // Set files
                const filesArr = [];
                var storage = 0;
                collection.forEach((doc) => {
                    filesArr.push(doc.data());
                    storage += doc.data().size ? doc.data().size : 0;
                });

                // Add files to array
                setFiles(filesArr);

                // Calculate and add storage
                setStorage(storage);
            });

        return () => listener();
    }, [userRecord.uid]);

    return ReactDom.createPortal(
        <div className={styles.wrapper}>
            <motion.div
                onClick={handleClose}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                className={styles.bg}
            />
            <motion.div
                animate={{ marginTop: "40px" }}
                exit={{ marginTop: "100vh" }}
                transition={{ type: "spring", stiffness: 250, damping: 25 }}
                className={styles.container}
            >
                <div className={styles.close} onClick={handleClose}>
                    <MdClose />
                </div>
                <h1 className={styles.title}>{userRecord.email}</h1>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <p
                        style={{ color: "var(--darkGrey)", margin: "10px 0" }}
                    >{`Created on ${timestamp_to_date(
                        userRecord.creation_time
                    )}`}</p>
                    <Tag
                        textContent={
                            userRecord.temporary
                                ? "temporary account"
                                : "active account"
                        }
                        variant={userRecord.temporary && "pending"}
                        style={{ marginLeft: "15px" }}
                    />
                </div>

                <Divider />
                <div style={{ display: "flex", height: "100%" }}>
                    <div style={{ width: "40%" }}>
                        <p style={{ color: "var(--darkGrey)" }}>
                            Copy this link to share files
                        </p>
                        <CopyText
                            text={`http://localhost:3000/delivery?u=${userRecord.uid}`}
                        />
                        <div style={{ display: "flex", marginTop: "20px" }}>
                            <div>
                                <p style={{ color: "var(--darkGrey)" }}>
                                    Days till deletion
                                </p>
                                <p
                                    className={
                                        timerActive
                                            ? daysTillDel > 14
                                                ? styles.blue
                                                : daysTillDel > 7
                                                ? styles.yellow
                                                : styles.red
                                            : styles.grey
                                    }
                                >
                                    {daysTillDel}
                                    {/*<MdArrowDropDown />*/}
                                </p>
                                {timerActive ? (
                                    <ButtonFilled
                                        textContent="Stop timer"
                                        thin
                                        red
                                        style={{ width: "120px" }}
                                        onClick={toggleTimer}
                                    />
                                ) : (
                                    <ButtonFilled
                                        textContent="Start timer"
                                        thin
                                        style={{ width: "120px" }}
                                        onClick={toggleTimer}
                                    />
                                )}
                            </div>
                            <div style={{ marginLeft: "50px" }}>
                                <div>
                                    <p style={{ color: "var(--darkGrey)" }}>
                                        Storage used
                                    </p>
                                    <p>{prettier_size(storage / 1000000)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ width: "60%" }}>
                        <CustomerFiles userRecord={userRecord} files={files} />
                        <div></div>
                    </div>
                </div>
            </motion.div>
        </div>,
        document.getElementById("portal")
    );
}

export default CustomerContainer;
