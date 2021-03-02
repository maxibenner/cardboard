import React, { useRef, useContext, useEffect } from "react";
import styles from "./customerFiles.module.css";
import ButtonGhost from "../buttonGhost/ButtonGhost";
import CustomerFilesCard from "../../components/customerFilesCard/CustomerFilesCard";
import SpinnerSmallGrey from "../../components/spinnerSmallGrey/SpinnerSmallGrey";
import { UploaderContext } from "../../contexts/UploaderContext";
import { AuthContext } from "../../contexts/Auth";
import firebase from "../../lib/firebase";
import { MdArrowForward } from "react-icons/md";

function CustomerFiles({ files, userRecord }) {
    const [uploads, dispatchUpload] = useContext(UploaderContext);
    const { token } = useContext(AuthContext);

    const inputRef = useRef(null);
    const formRef = useRef(null);

    // Handle UPLOAD click
    const handleUploadClick = () => {
        inputRef.current.click();
    };

    // Handle file upload selection
    const onFileChange = (e) => {
        dispatchUpload(userRecord, token.claims.business, [...e.target.files]);
        e.target.files.value = "";
        formRef.current.reset();
    };

    // Get thumbnail urls
    useEffect(() => {
        // Add thumbnail url
        if (files) {
            files.forEach(async (file) => {
                //Check if file has thumbnail_key => add thumbnail_url if it doesn't exist
                if (file.thumbnail_key && file.thumbnail_url === undefined) {
                    // Get download url
                    const url = await firebase
                        .storage()
                        .ref()
                        .child(file.thumbnail_key)
                        .getDownloadURL();

                    // Update firestore
                    firebase
                        .firestore()
                        .collection("users")
                        .doc(file.owner)
                        .collection("files")
                        .doc(file.storage_key.split("/")[2].split(".")[0])
                        .update({
                            thumbnail_url: url,
                            business: token.claims.business,
                        });
                }
            });
        }
    }, [files]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.thumbnail}>{""}</h3>
                <h3 className={styles.name}>Filename</h3>
                <h3 className={styles.size}>Size</h3>
                <h3 className={styles.date}>Uploaded</h3>
            </div>
            <div className={styles.filesContainer}>
                {uploads.length > 0 && (
                    <div className={styles.uploadBanner}>
                        <p
                            className={styles.activeUploads}
                        >{`Active uploads: ${uploads.length}`}</p>
                        <a className={styles.uploadManagerLink}>
                            Go to upload manager{" "}
                            <MdArrowForward style={{ marginLeft: "5px" }} />
                        </a>
                    </div>
                )}
                {files === undefined ? (
                    <SpinnerSmallGrey
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                        }}
                    />
                ) : files.length === 0 ? (
                    <div className={styles.noFiles}>No files</div>
                ) : (
                    files.map((file) => {
                        return (
                            <CustomerFilesCard
                                file={file}
                                key={file.creation_time}
                            />
                        );
                    })
                )}
            </div>
            <div style={{ width: "fit-content", margin: "15px 0 0 auto" }}>
                <ButtonGhost
                    style={{ width: "200px" }}
                    textContent="Add files"
                    onClick={handleUploadClick}
                />
                <form ref={formRef}>
                    <input
                        className={styles.hiddenInput}
                        type="file"
                        multiple
                        ref={inputRef}
                        onChange={onFileChange}
                    />
                </form>
            </div>
        </div>
    );
}

export default CustomerFiles;
