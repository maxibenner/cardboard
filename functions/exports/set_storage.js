const { admin, functions, s3 } = require("../lib/init");

// Add filesize
exports.set_storage = functions.firestore
    .document("users/{userId}/files/{docId}")
    .onCreate(async (snap, context) => {
        // Get file metadata from Wasabi
        const metaData = await s3
            .headObject({
                Bucket: functions.config().wasabi.bucket,
                Key: snap.data().storage_key,
            })
            .promise();

        // Get file size from metadata
        const new_file_size_bytes = metaData.ContentLength;

        // Update file size in file doc
        admin
            .firestore()
            .collection("users")
            .doc(context.params.userId)
            .collection("files")
            .doc(snap.id)
            .update({
                size: new_file_size_bytes,
            });

        //__________ BUSINESS/CUSTOMER __________//
        if (snap.data().business === undefined) {
            // USER
            // Update storage doc
            admin
                .firestore()
                .collection("users")
                .doc(context.params.userId)
                .update({
                    capacity_used: admin.firestore.FieldValue.increment(
                        new_file_size_bytes
                    ),
                });
        } else {
            // BUSINESS
            // Update storage doc
            admin
                .firestore()
                .collection("businesses")
                .doc(snap.data().business)
                .update({
                    capacity_used: admin.firestore.FieldValue.increment(
                        new_file_size_bytes
                    ),
                });
        }
    });
