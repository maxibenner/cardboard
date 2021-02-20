export function validate_email(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
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
