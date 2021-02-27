import React, { useState, useEffect } from "react";
import ReactDom from "react-dom";
import styles from "./customerContainer.module.css";
import { MdClose, MdArrowDropDown } from "react-icons/md";
import Divider from "../../components/divider/Divider";
import CopyText from "../../components/copyText/CopyText";
import CustomerFiles from "../../components/customerFiles/CustomerFiles";
import firebase from "../../lib/firebase";
import { prettier_size, timestamp_to_date } from "../../helpers/tools";
import { motion } from "framer-motion";
import Tag from "../../components/tag/Tag";

function CustomerContainer({ userRecord, handleClose }) {
    // files
    const [files, setFiles] = useState(undefined);
    const [storage, setStorage] = useState(0);
    const [daysTillDel, setDaysTillDel] = useState(90);

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
                        textContent={userRecord.temporary ? "temporary account" : "active account"}
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
                        <div style={{ display: "flex" }}>
                            <div>
                                <p style={{ color: "var(--darkGrey)" }}>
                                    Storage used
                                </p>
                                <p>{prettier_size(storage / 1000000)}</p>
                            </div>
                            <div style={{ marginLeft: "50px" }}>
                                <p style={{ color: "var(--darkGrey)" }}>
                                    Days till deletion
                                </p>
                                <p style={{ color: "var(--blue)" }}>
                                    {daysTillDel}
                                    <MdArrowDropDown />
                                </p>
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
