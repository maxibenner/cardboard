const { admin, functions } = require("../lib/init");

// Create Business Profile
exports.create_business = functions.https.onCall(async (data, context) => {
    // Get data
    const name = data.name.toLowerCase().replace(" ", "-")

    // Get business document
    const doc = await admin
        .firestore()
        .collection("businesses")
        .doc(name)
        .get();

    // Return if doc already exists
    if (doc.data()) {
        return {
            code: "500",
            message: `Business already exists.`,
        };
    }

    try {
        // Add customs claims to user
        await admin.auth().setCustomUserClaims(context.auth.uid, {
            business: name,
            capacity_used: 0,
            role: "admin",
        });

        // Create new business profile
        await admin.firestore().collection("businesses").doc(name).set({
            name: name,
            owner: context.auth.uid
        });

    } catch (err) {
        return {
            code: "500",
            message: `Business creation failed.`,
            body: err,
        };
    }

    // Success
    return {
        code: "200",
        message: `Successfully created business profile for ${name}.`,
    };
});
