import React from "react";
import Menu from "../../components/menu/Menu";
import styles from "./styles.module.css";

function Dashboard(props) {
    return (
        <div style={{ display: "flex" }}>
            <Menu />
            <div className={styles.container}>
                <h1 className={styles.title}>Dashboard</h1>
            </div>
        </div>
    );
}

export default Dashboard;
