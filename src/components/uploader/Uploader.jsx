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
		if (files.length === 0) return;

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
	useEffect(() => {

		// Prevent running on empty array
		if (uploads.length === 0) return;

		// Limit number of uploads
		const activeUploads = uploads.filter((el) => el.active === true);
		if (activeUploads.length > 2) return;

		// Get first file from queue while preventing duplicates
		const file = uploads.find((el) => el.active === false).file;

		// Get file id
		const fileId = file.id;

		// Add xhr to file
		createXhr(file).then((xhr) => {
			// Append xhr to element
			file.xhr = xhr;

			// Activate
			file.active = true;

			// Get index
			const i = uploads.findIndex((el) => el.id === fileId);

			//Push to active Uploads
			setUploads((prev) => {
				prev[i] = file;
				return [...prev];
			});

			// Start upload
			xhr.send(file);
		});

		// .then((xhr) => {
		//
		// });
	}, [uploads /*, env, firebase, user.uid*/]);

	// Create xhr
	async function createXhr(file) {
		console.log(file)
		// Get upload url
		const { url, uuid, key, name } = await getSignedUploadUrl({
			name: file.name,
			type: file.type,
		});

		// Get file id
		const fileId = file.id;

		// Create XHR object
		const xhr = new XMLHttpRequest();

		// onProgress
		xhr.upload.onprogress = (e) => {
			// Get progress
			const percentage = (e.loaded / e.total) * 100;

			//Push to active Uploads
			updateUpload(fileId, percentage);
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
		xhr.onload = async () => {
			// Set database
			const res = await checkWasabiFile(key);

			// Proceed if file exists
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
					fetch(`https://api.cardboard.video/video-thumb-${env}?key=${key}`);
				}
			} else {
				window.alert("There was a problem with your upload. Please try again.");
			}

			// Remove from uploads
			removeUpload(fileId);
		};

		xhr.open("PUT", url, true);
		xhr.setRequestHeader("Content-Type", file.type);

		return xhr;
	}

	// Remove item from upload
	const removeUpload = (fileId) => {
		setUploads((prev) => {
			const index = prev.findIndex((el) => el.id === fileId);
			prev.splice(index, 1);
			return prev ? [...prev] : [];
		});
	};

	// Update upload objects
	const updateUpload = (id, value) => {
		setUploads((prev) => {
			const items = [...prev];
			console.log(items);
			console.log(id)
			const i = items.findIndex((el) => el.id === id);
			console.log(i)
			items[i].progress = value;
			return [...items];
		});
	};

	return (
		<>
			{uploads && uploads.length > 0 && (
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
