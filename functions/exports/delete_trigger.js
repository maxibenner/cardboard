const { admin, functions, gcs, s3 } = require("../lib/init");

// Delete Files trigger
exports.delete_trigger = functions.firestore
    .document("users/{userId}/files/{docId}")
    .onDelete(async (snap, context) => {
        const file = snap.data();

        //Get stored data
        let storageDoc = await admin
            .firestore()
            .collection("users")
            .doc(context.params.userId)
            .get();
        let capacity_used = storageDoc.data().capacity_used;

        // Update storage doc
        admin
            .firestore()
            .collection("users")
            .doc(context.params.userId)
            .update({
                capacity_used: capacity_used - file.size,
            });

        // Remove file from Wasabi
        await s3
            .deleteObject({
                Bucket: functions.config().data.wasabi.bucket,
                Key: file.storage_key,
            })
            .promise();

        // Remove thumbnail from GCS
        if (file.thumbnail_key) {
            const bucket = gcs.bucket(
                functions.config().data.wasabi.bucket + ".appspot.com"
            );
            await bucket.file(file.thumbnail_key).delete();
        } else {
            console.log("No thumbnail");
        }

        // Check for and remove share dirs
        if (file.share_id) {
            // Remove from user share dir
            admin
                .firestore()
                .collection("users")
                .doc(file.owner)
                .collection("public")
                .doc("shared")
                .collection(file.share_id)
                .doc(snap.id)
                .delete();

            // Remove from public share dir
            admin
                .firestore()
                .collection("public")
                .doc("shared")
                .collection(file.share_id)
                .doc(snap.id)
                .delete();
        }

        // Check for and remove transcoded child
        if (file.transcoded_child_id) {
            const transcoded_child = await admin
                .firestore()
                .collection("users")
                .doc(file.owner)
                .collection("files")
                .doc(file.transcoded_child_id)
                .get();
            if (transcoded_child.exists) {
                await admin
                    .firestore()
                    .collection("users")
                    .doc(file.owner)
                    .collection("files")
                    .doc(file.transcoded_child_id)
                    .delete();
            }
        } else {
            console.log("No transcoded child");
        }

        // Check for and remove source file
        if (file.source_file_id) {
            const sourceDoc = await admin
                .firestore()
                .collection("users")
                .doc(file.owner)
                .collection("files")
                .doc(file.source_file_id)
                .get();
            if (sourceDoc.exists) {
                admin
                    .firestore()
                    .collection("users")
                    .doc(file.owner)
                    .collection("files")
                    .doc(file.source_file_id)
                    .delete();
            }
        } else {
            console.log("No source file");
        }
    });
