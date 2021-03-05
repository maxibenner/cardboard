import { firebase } from "../lib/firebase";

//Get signed upload url and create file doc
export async function getSignedUploadUrl(file) {
	// Extract information from filename (with dot safety)
	const partsArray = file.name.split(".");
	const fileName = partsArray.join(".");

	const res = await firebase.functions().httpsCallable("signUploadUrl")({
		contentType: file.type,
		name: file.name,
	});

	return {
		url: res.data.url,
		uuid: res.data.uuid,
		key: res.data.key,
		name: fileName,
	};
}

//Check if file exists on Wasabi
export async function checkWasabiFile(key) {
	return await firebase.functions().httpsCallable("checkWasabiFile")(key);
}

// Check if image is reachable behind url
export async function fileStatus(image_url) {
	if (image_url) {
		var http = new XMLHttpRequest();

		http.open("HEAD", image_url, false);
		http.send();

		return http.status;
	} else {
		return 404;
	}
}

// Turn bites into nice sizes
export function prettier_size(size) {
	const mb = size/1000000
    return mb > 1000
        ? `${(size / 1000).toFixed(1)} GB`
        : `${(size/ 1000000).toFixed(0)} MB`;
}
