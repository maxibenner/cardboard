const { admin, functions } = require("../lib/init");

// Create Business Profile
exports.create_business = functions.https.onCall(async (data, context) => {
    // Get data
    const name = data.name.toLowerCase();
    //const color = data.color.toLowerCase();

    // Check data
    /*if (!/^([0-9A-F]{3}){1,2}$/i.test(color)) {
        return {
            code: "500",
            message: `Data does not contain a valid hex code color.`,
        };
    }*/

    // Get business document
    const doc = await admin
        .firestore()
        .collection("businesses")
        .doc(name)
        .get();

    // Check if document exists
    if (doc.data()) {
        // Exists
        return {
            code: "500",
            message: `Business already exists.`,
        };
    } else {
        // Does not exist
        try {
            // Add customs claims to user
            await admin.auth().setCustomUserClaims(context.auth.uid, {
                role: "admin",
                business: name,
            });

            // Create new business profile
            await admin.firestore().collection("businesses").doc(name).set({
                name: name,
                color: color,
            });
        } catch (err) {
            return {
                code: "500",
                message: `Business creation failed.`,
            };
        }

        // Success
        return {
            code: "200",
            message: `Successfully created business profile for ${data.name}.`,
        };
    }
});