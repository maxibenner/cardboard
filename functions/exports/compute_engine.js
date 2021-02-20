const { admin, compute, functions } = require("../lib/init");

//HTTP credential
const httpCred = "h27d-x9f3-4j0s-23okv-fd9d";

// Start Compute Engine
async function start_compute_engine() {
    //Get blockers
    const autoStartInstance = await admin
        .firestore()
        .collection("settings")
        .doc("blockers")
        .get();

    if (autoStartInstance.data().autoStartInstance === true) {
        // Define instance
        var zone = compute.zone("asia-east1-a");
        var vm = zone.vm("instance-main");

        await vm.start((err, operation, apiResponse) => {
            if (err !== null) {
                console.log(err);
            } else {
                console.log("instance start successfully");
            }
        });
        return;
    } else {
        return console.log("Instance auto start has been blocked");
    }
}
// Stop Compute Engine
exports.stop_compute_engine = functions.https.onRequest(
    async (request, response) => {
        // Check credentials
        if (request.body.credentials === httpCred) {
            // Define instance
            var zone = compute.zone("asia-east1-a");
            var vm = zone.vm("instance-main");

            console.log("Attempting to stop instance");

            // Stop instance
            await vm.stop((err, operation, apiResponse) => {
                if (err !== null) {
                    return response.send("ERROR: " + err);
                } else {
                    return response.send(
                        "The instance has been successfully stopped."
                    );
                }
            });
        } else {
            console.log("Insufficient permissions for this http request");
            return response.send(
                "Insufficient permissions for this http request"
            );
        }
    }
);