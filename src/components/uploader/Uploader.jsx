import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import UploadElement from "../uploadElement/UploadElement";
import ButtonExpand from "../buttonExpand";
import { v4 as uuidv4 } from "uuid";

import { getSignedUploadUrl, checkWasabiFile } from "../../helpers/tools";

export default function Uploader({ firebase, user, files }) {
	const [open, setOpen] = useState(true);

	const [uploads, setUploads] = useState([]);

	// Get env
	const env = process.env.NODE_ENV === "production" ? "live" : "dev";

	// Push to queue
	useEffect(() => {
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
			if (uploads.filter((el) => el.id === fileId && el.active === true) !== 0)
				return;

			// Limit number of uploads
			const activeUploads = uploads.filter((el) => el.active === true);
			if (activeUploads.length >= 3) return;

			//__________ Add upload __________//

			// Upload setup
			getSignedUploadUrl(file)
				.then(({ url, uuid, key, name }) => {
					//____________ XHR Setup ____________//
					var xhr = new XMLHttpRequest();

					// onProgress
					xhr.upload.onprogress = (e) => {
						// Get progress
						const percentage = (e.loaded / e.total) * 100;

						//Push to active Uploads
						setUploads((prev) => {
							if (prev === undefined) return;
							const i = prev.findIndex((el) => el.id === fileId);
							if (prev[i] === undefined) return;
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
						// Set database
						checkWasabiFile(key).then(async (res) => {
							if (res.data) {
								// Get download url
								const urlObject = await firebase
									.functions()
									.httpsCallable("sign_wasabi_download_url")({
									storage_key: key,
								});

								// Create Firestore object
								await firebase
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
										url: urlObject.data,
									});

								// Get thumbnails
								if (file.type.split("/")[0] === "image") {
									//Image
									await fetch(
										`https://api.cardboard.video/img-thumb-${env}?key=${key}`
									);
								} else if (file.type.split("/")[0] === "video") {
									//Video
									fetch(
										`https://api.cardboard.video/video-thumb-${env}?key=${key}`
									);
								}
							} else {
								window.alert(
									"There was a problem with your upload. Please try again."
								);
							}

							// Remove from uploads
							setUploads((prev) => {
								const index = prev.findIndex((el) => el.id === fileId);
								prev.splice(index, 1);
								return [...prev];
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
						return [...prev];
					});
				});
		},
		[uploads, env, firebase, user.uid]
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
