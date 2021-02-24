import React from "react";
import ButtonFilled from "../buttonFilled/ButtonFilled";
import ButtonLight from "../buttonLight";
import styles from "./cardDelivery.module.css";

function CardDelivery({ company, files, onAccept, onDecline }) {
    const name = company.charAt(0).toUpperCase() + company.slice(1);

    return (
        <div className={styles.container}>
            <p>Delivery from</p>
            <h1>{name}</h1>
            <h3>{files === 1 ? `${files} file` : `${files} files`}</h3>
            <ButtonFilled
                onClick={() => onAccept(name)}
                thin
                textContent="Accept"
            />
            <ButtonLight
                onClick={() => onDecline(name)}
                style={{ marginTop: "5px" }}
                red
                title="Decline"
            />
        </div>
    );
}

export default CardDelivery;
