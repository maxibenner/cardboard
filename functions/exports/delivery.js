const { admin, functions } = require("../lib/init");

exports.delivery_accept = functions.https.onCall(async (data, context) => {
    // IMPORTANT: Accepting delivery only works from user client. Context is necessary for document discovery.

    // Early returns
    if (!data.businessName)
        return { code: 500, message: "Business name missing" };
    if (!data.fileIds) return { code: 500, message: "File ids missing" };

    const fileIds = data.fileIds;

    // Accumulate storage of all files to be transferred
    var accumulated_storage = 0;

    // Get total storage requirements from files
    async function getStorage() {
        const promises = fileIds.map(async (id) => {
            const doc = await admin
                .firestore()
                .collection("users")
                .doc(context.auth.uid)
                .collection("files")
                .doc(id)
                .get();

            // Accumlate storage
            accumulated_storage += doc.data().size;
        });

        await Promise.all(promises);
    }
    await getStorage();

    // Get available customer storage
    const customerDoc = await admin
        .firestore()
        .collection("users")
        .doc(context.auth.uid)
        .get();
    const customer_storage = customerDoc.data().storage_capacity;

    // Check if user has enough storage
    if (accumulated_storage > customer_storage)
        return { code: 500, message: "Insufficient storage capacity" };

    // Accept files from array
    fileIds.forEach((fileId) => {
        // Accept file
        admin
            .firestore()
            .collection("users")
            .doc(context.auth.uid)
            .collection("files")
            .doc(fileId)
            .update({
                accepted: true,
            });
    });

    // Switch storage responsibility from business to customer
    // Update customer storage doc
    admin
        .firestore()
        .collection("users")
        .doc(context.auth.uid)
        .update({
            capacity_used: admin.firestore.FieldValue.increment(
                accumulated_storage
            ),
        });

    // Update business storage doc
    admin
        .firestore()
        .collection("businesses")
        .doc(data.businessName)
        .update({
            capacity_used: admin.firestore.FieldValue.increment(
                -accumulated_storage
            ),
        });

    return {
        code: 200,
        message: "Successfully accepted delivery"
    };
});

exports.delivery_decline = functions.https.onRequest(
    async (request, response) => {}
);
