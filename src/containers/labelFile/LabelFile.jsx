import React, { useState, useRef, useEffect } from "react";
import styles from "./styles.module.css";
import InputWithButton from "../../components/inputWithButton";
import Tag from "../../components/tag";

export default function LabelFile(props) {
	const [input, setInput] = useState(null);
	const [tags, setTags] = useState(props.file.tags ? props.file.tags : []);
	const inputElement = useRef();

	// Sync input value state
	const handleInputChange = (value) => {
		setInput(value.toLowerCase());
	};

	// Add tag to array (check if it already exists before)
	const addTag = (e, tag) => {
		e.preventDefault();

		// Add tag to array
		!tags.includes(tag)
			? setTags([...tags, tag])
			: window.alert(`The label "${tag}" already exists.`);

		// Clear input element
		inputElement.current.value = "";
	};

	// Remove tag from array
	const removeTag = (tag) => {
		setTags(tags.filter((e) => e !== tag));
	};

	// Submit tags to Friestore
	useEffect(() => {
		props.firebase
			.firestore()
			.collection("users")
			.doc(props.user.uid)
			.collection("files")
			.doc(props.file.id)
			.update({
				tags: tags,
			});
	}, [tags, props.file.id, props.firebase, props.user.uid]);

	// Focus input
	useEffect(() => {
		inputElement.current.focus();
	}, []);

	return (
		<div className={styles.wrapper}>
			<div className={styles.container}>
				<div className={styles.tagContainer}>
					{tags.map((tag) => {
						return (
							<Tag key={tag} title={tag} onCancel={() => removeTag(tag)} />
						);
					})}
				</div>
				<form
					className={styles.inputContainer}
					onSubmit={(e) => addTag(e, input)}
				>
					<InputWithButton
						passRef={inputElement}
						onChange={handleInputChange}
					/>
				</form>
			</div>
			<div
				className={styles.background}
				onClick={() => props.handleModal(null)}
			/>
		</div>
	);
}
