const { admin, functions } = require("../lib/init");

// Global variables
const freeCapacity = 3000000000; /*3GB*/

// Set user storage data on signup
exports.setUserData = functions.auth.user().onCreate(async (user) => {
    
    // Setup user
    admin.firestore().collection("users").doc(user.uid).set(
        {
            capacity_used: 0,
            creation_time: admin.database.ServerValue.TIMESTAMP,
            email: user.email,
            temporary: false,
            storage_capacity: freeCapacity,
            uid: user.uid
        },
        { merge: true }
    );

    return console.log(`Added storage info to user ${user.uid}.`);
});
