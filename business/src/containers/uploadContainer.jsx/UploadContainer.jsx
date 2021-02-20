import React, { useState, useEffect } from "react";
import ReactDom from "react-dom";
import styles from "./customerContainer.module.css";
import { MdClose, MdArrowDropDown } from "react-icons/md";
import Divider from "../../components/divider/Divider";
import CustomerFiles from "../../components/customerFiles/CustomerFiles";
import firebase from "../../lib/firebase";
import { prettier_size } from "../../helpers/tools";
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

        setTimeout(() => {
            // Get firestore doc
            firebase
                .firestore()
                .collection("users")
                .doc(uid)
                .collection("files")
                .where("business", "==", "lalaland")
                .get()
                .then((collection) => {
                    // Set files
                    const filesArr = [];
                    var storage = 0;
                    collection.forEach((doc) => {
                        filesArr.push(doc.data());
                        storage += doc.data().size;
                    });

                    // Add files to array
                    setFiles(filesArr);

                    // Calculate and add storage
                    setStorage(storage);
                })
                .catch((err) => {
                    setFiles(null);
                    setStorage(0);
                    window.alert(err);
                });
        }, 500);
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
                <div style={{ display: "flex", alignItems:"center" }}>
                    <p
                        style={{ color: "var(--darkGrey)", margin:"10px 0" }}
                    >{`Created on ${userRecord.metadata.creationTime.slice(
                        4,
                        16
                    )}`}</p>
                    <Tag textContent="active account" style={{marginLeft: "15px"}} />
                </div>

                <Divider />
                <div style={{ display: "flex", height: "100%" }}>
                    <div style={{ width: "40%" }}>
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
                                <p style={{color: "var(--blue)"}}>{daysTillDel}<MdArrowDropDown/></p>
                            </div>
                        </div>
                    </div>
                    <div style={{ width: "60%" }}>
                        <CustomerFiles files={files} />
                        <div></div>
                    </div>
                </div>
            </motion.div>
        </div>,
        document.getElementById("portal")
    );
}

export default CustomerContainer;
