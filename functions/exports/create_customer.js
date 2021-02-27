const { admin, functions } = require("../lib/init");

// Global variables
const freeCapacity = 3000000000; /*3GB*/

// Set user storage data on signup
exports.create_customer = functions.https.onCall(async (data) => {
    // creation time
    const creation_time = Date.now()

    // user object
    const userObject = {
        capacity_used: 0,
        creation_time: creation_time,
        email: data.email,
        temporary: true,
        storage_capacity: freeCapacity,
    };

    try {
        // Create user doc
        const doc = await admin.firestore().collection("users").add(userObject);

        // Add new userId/docId to userObject
        userObject.uid = doc.id;
    } catch (err) {
        throw new functions.https.HttpsError("unknown", err.message);
    }

    return {
        code: 200,
        message: "Successfully created temporary user doc.",
        userRecord: userObject,
    };
});
