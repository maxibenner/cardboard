import React from "react";
import styles from "./styles.module.css";

export default function CardSimple(props) {
	const classes = `${styles.card} ${props.yellow ? styles.card_yellow : ""} ${
		props.large && styles.large
	}`;

	return (
		<div className={classes} onClick={props.onClick}>
			<img
				width={"150px"}
				height={"150px"}
				className={styles.img}
				src={props.imgSrc}
				alt={props.imgAlt}
			/>
			<p className={styles.title}>{props.title}</p>
			{props.sub && <p className={styles.sub}>{props.sub}</p>}
			{props.button && <div className={styles.button}>{props.button}</div>}
		</div>
	);
}
