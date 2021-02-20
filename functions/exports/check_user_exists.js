const { admin, functions } = require("../lib/init");

// Check if user exists
exports.check_user_exists = functions.https.onCall(async (data) => {
    try {
        const userRecord = await admin.auth().getUserByEmail(data.email);
        return {
            code: 200,
            message: "User exists",
            exists: true,
            userRecord: userRecord,
        };
    } catch (error) {
        return {
            code: 200,
            exists: false,
            message: "User does not exist",
        };
    }
});
