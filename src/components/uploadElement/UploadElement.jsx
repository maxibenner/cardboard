import React from "react";
import styles from "./styles.module.css";
import ButtonCancel from "../buttonCancel";
import ProgressBar from "../progressBar";

export default function UploadElement({ name, active, progress, xhr, id, removeUpload }) {
	console.log('progress for', id, progress)
	const classes = `${styles.uploadElement} ${!active && styles.inactive}`;

	const clickHandler = () => {
		removeUpload(id)
	};

	console.log(progress)

	return (
		<div className={classes}>
			<div className={styles.textContainer}>
				<p className={styles.fileName}>{name}</p>
				{!active && <p>waiting</p>}
			</div>

			<div className={styles.interactiveContainer}>
				<ProgressBar progress={progress} />
				<ButtonCancel small onClick={clickHandler} />
			</div>
		</div>
	);
}
