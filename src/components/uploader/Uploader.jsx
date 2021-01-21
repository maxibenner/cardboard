import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import UploadElement from "../uploadElement/UploadElement";
import ButtonExpand from "../buttonExpand";
import { v4 as uuidv4 } from "uuid";

import { getSignedUploadUrl, checkWasabiFile } from "../../helpers/tools";

export default function Uploader({ firebase, user, files }) {
	const [open, setOpen] = useState(true);

	const [uploads, setUploads] = useState([]);

	// Set number of simultaneously allowed uploads
	const parallelUploads = 3;

	// Get env
	const env = process.env.NODE_ENV === "production" ? "live" : "dev";

	// Push to queue
	useEffect(() => {
		console.log(files);
		if (!files || files.length === 0) return;

		setUploads((prev) => {
			const newArray = [...prev];

			// Add data to each file
			files.forEach((file) => {
				const id = uuidv4();
				const newFile = {
					active: false,
					file: file,
					id: id,
					name: file.name,
					progress: 0,
					push: false,
				};
				newArray.push(newFile);
			});

			return [...newArray];
		});
	}, [files]);

	// Activate upload
	useEffect(
		(prev) => {
			if (prev && prev.length > uploads.length) return;
			if (uploads.length === 0) return;

			// Get new file
			const newFile = uploads.find((el) => el.active === false);

			// Make sure it exists
			if (!newFile) return;

			// Get file
			const file = newFile.file;

			// Get file id
			const fileId = newFile.id;

			// Prevent duplicates
			if (uploads.filter((el) => el.id === fileId && el.active === true) != 0)
				return;

			// Limit number of uploads
			const activeUploads = uploads.filter((el) => el.active === true);
			if (activeUploads.length >= 3) return;

			//__________ Add upload __________//

			// Upload setup
			getSignedUploadUrl(newFile.file)
				.then(({ url, uuid, key, name }) => {
					console.log("running");
					//____________ XHR Setup ____________//
					var xhr = new XMLHttpRequest();

					// onProgress
					xhr.upload.onprogress = (e) => {
						// Get progress
						const percentage = (e.loaded / e.total) * 100;

						//Push to active Uploads
						setUploads((prev) => {
							const i = prev.findIndex((el) => el.id === fileId);
							prev[i].progress = percentage;
							return [...prev];
						});
					};

					// onError
					xhr.onerror = () => {
						xhr.abort();
					};

					// onAbort
					xhr.onabort = () => {
						removeUpload(fileId);
					};

					// onSuccess
					xhr.onload = () => {
						console.log("loaded");
						// Set database
						checkWasabiFile(key).then((res) => {
							if (res.data) {
								// Add to firestore
								firebase
									.firestore()
									.collection("users")
									.doc(user.uid)
									.collection("files")
									.doc(uuid)
									.set({
										storage_key: key,
										name: name.split(".")[0],
										owner: user.uid,
										path: "/",
										suffix: key.split(".")[1],
										tags: [],
										type: file.type.split("/")[0],
									})
									.then(() => {
										if (file.type.split("/")[0] === "image") {
											//image
											fetch(
												`https://api.cardboard.video/img-thumb-${env}?key=${key}`
											)
												.then(function (response) {
													console.log(response);
													return;
												})
												.catch(function (error) {
													console.log(error);
												});
										} else if (file.type.split("/")[0] === "video") {
											//video
											fetch(
												`https://api.cardboard.video/video-thumb-${env}?key=${key}`
											)
												.then(function (response) {
													console.log(response);
													return;
												})
												.catch(function (error) {
													console.log(error);
												});
										}
									});
							} else {
								window.alert(
									"There was a problem with your upload. Please try again."
								);
							}

							setUploads((prev) => {
								const index = prev.map((el) => el.id).indexOf(fileId);
								prev.splice(index, 1);
								return prev ? [...prev] : [];
							});
						});
					};

					xhr.open("PUT", url, true);
					xhr.setRequestHeader("Content-Type", file.type);
					xhr.send(file);

					return xhr;
				})
				.then((xhr) => {
					// Append xhr to element
					newFile.xhr = xhr;

					// Activate
					newFile.active = true;

					// Get index
					const i = uploads.findIndex((el) => el.id === fileId);
					//Push to active Uploads
					setUploads((prev) => {
						prev[i] = newFile;
						return prev;
					});
				});
		},
		[uploads]
	);

	// Remove item from upload
	const removeUpload = (fileId) => {
		setUploads((prev) => {
			const index = prev.findIndex((el) => el.id === fileId);
			prev.splice(index, 1);
			return prev ? [...prev] : [];
		});
	};

	return (
		<>
			{uploads.length > 0 && (
				<div className={styles.uploader}>
					<div className={styles.header}>
						<p>Uploads</p>
						<ButtonExpand light onClick={() => setOpen((state) => !state)} />
					</div>
					<div
						className={`${styles.filesContainer} ${
							open === false && styles.closed
						}`}
					>
						{uploads.map((el) => (
							<UploadElement
								active={el.active ? true : false}
								key={el.id}
								id={el.id}
								progress={el.progress}
								name={el.name}
								xhr={el.xhr}
								removeWaiting={() => removeUpload()}
							/>
						))}
					</div>
				</div>
			)}
		</>
	);
}
