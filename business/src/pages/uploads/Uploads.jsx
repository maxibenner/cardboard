import React, { useContext } from "react";
import Menu from "../../components/menu/Menu";
import styles from "./uploads.module.css";
import { UploaderContext } from "../../contexts/UploaderContext";

function Uploads(props) {
    const [uploads] = useContext(UploaderContext);
    return (
        <div style={{ display: "flex" }}>
            <Menu />
            <div className={styles.container}>
                <h1 className={styles.title}>Uploads</h1>
                <p>{`${uploads.length} active uploads.`}</p>
            </div>
        </div>
    );
}

export default Uploads;
