import firebase from "../lib/firebase";

export function validate_email(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export async function sign_upload_url_business(file) {
    // Extract information from filename (with dot safety)
    const partsArray = file.name.split(".");
    const fileName = partsArray.join(".");

    const res = await firebase
        .functions()
        .httpsCallable("sign_upload_url_business")({
        contentType: file.type,
        name: file.name,
        owner_uid: file.owner_uid,
    });

    if (res.data.code !== 200)
        throw new Error({ code: res.data.code, message: res.data.message });

    return {
        url: res.data.url ? res.data.url : null,
        uuid: res.data.uuid ? res.data.uuid : null,
        key: res.data.key ? res.data.key : null,
        name: fileName,
    };
}

export async function checkWasabiFile(key) {
    return await firebase.functions().httpsCallable("checkWasabiFile")(key);
}

export function timestamp_to_date(timestamp) {
    // Create a new JavaScript Date object based on the timestamp
    var dateObject = new Date(timestamp);

    // Get month
    const month = dateObject.toLocaleString("default", { month: "numeric" });

    // Get days
    const day = dateObject.toLocaleString("default", { day: "numeric" });

    // Get year
    const year = dateObject
        .toLocaleString("default", { year: "numeric" })
        .slice(2);

    return `${month}/${day}/${year}`;
}

export function prettier_size(size) {
    return size / 1000000 > 1000
        ? `${(size / 1000).toFixed(1)} GB`
        : `${size.toFixed(0)} MB`;
}

