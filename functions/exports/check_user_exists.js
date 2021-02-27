const { admin, functions } = require("../lib/init");

// Check if user exists
exports.check_user_exists = functions.https.onCall(async (data) => {
    const querySnapshot = await admin
        .firestore()
        .collection("users")
        .where("email", "==", data.email)
        .get();

    const arr = [];
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const newDoc = doc.data();
        newDoc.uid = doc.id;
        arr.push(newDoc);
    });

    if (arr.length > 0) {
        //exists
        return {
            code: 200,
            message: "User exists",
            exists: true,
            userRecord: arr[0],
        };
    } else {
        return {
            code: 200,
            exists: false,
            message: "User does not exist",
            userRecord: null,
        };
    }

    /*try {
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
    }*/
});
