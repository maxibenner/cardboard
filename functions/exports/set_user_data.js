const { admin, functions } = require("../lib/init");

// Global variables
const freeCapacity = 3000000000; /*3GB*/

// Set user storage data on signup
exports.set_user_data = functions.auth.user().onCreate(async (user) => {
    // Setup user
    admin.firestore().collection("users").doc(user.uid).set({
        storage_capacity: freeCapacity,
        capacity_used: 0,
    });

    return console.log(`Added storage info to user ${user.uid}.`);
});
