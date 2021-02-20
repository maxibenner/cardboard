const { admin, functions, s3 } = require("../lib/init");


// Add filesize
exports.set_storage = functions.firestore
    .document("users/{userId}/files/{docId}")
    .onCreate(async (snap, context) => {
        // VIDEO: Save to pending dir if video
        /*if (snap.data().type === 'video' && snap.data().isRaw === true) {
        await admin.firestore().collection("system").doc("processing").collection("files").doc(snap.id).set({
            name: snap.data().name,
            owner: snap.data().owner,
            type: snap.data().type,
            suffix: snap.data().suffix,
            action: "initial"
        })

        start_compute_engine()
    }*/

        // PROCESSING: Start compute engine if file needs processing (raw file with no children)
        /*if (snap.data().isRaw === true && !snap.data().children) {
        start_compute_engine()
    }*/

        // Get file metadata from Wasabi
        const metaData = await s3
            .headObject({
                Bucket: functions.config().data.wasabi.bucket,
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

        //Get currently utilized data
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
                capacity_used: capacity_used + new_file_size_bytes,
            });

        // STORAGE UPDATE: Check if document counts against storage and add to used storage amount
        /*if (snap.data().type === 'video' && snap.data().isRaw === false) {

        return functions.logger.info(`${snap.id} is child-data and does not count towards storage quota.`)

    } else {

        //Get currently utilized data amount
        let storageDoc = await admin.firestore().collection('users').doc(context.params.userId).get()
        let capacity_used = storageDoc.data().capacity_used

        // Update storage doc
        admin.firestore().collection('users').doc(context.params.userId).update({
            capacity_used: capacity_used + new_file_size_bytes
        })

        return functions.logger.info(`Added ${new_file_size_bytes / 1000000}MB to storage count of user ${context.params.userId}`)
    }*/
    });