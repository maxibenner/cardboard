//Functions
const functions = require('firebase-functions')

//Admin
const admin = require('firebase-admin')

//Storage
const { Storage } = require('@google-cloud/storage');
const gcs = new Storage()

// Compute engine
const Compute = require('@google-cloud/compute')
const compute = new Compute()

//Init
admin.initializeApp()

//HTTP credential
const httpCred = 'h27d-x9f3-4j0s-23okv-fd9d'

// AW Wasabi
var AWS = require('aws-sdk');
const s3 = new AWS.S3({
    correctClockSkew: true,
    endpoint: 's3.us-east-1.wasabisys.com',
    accessKeyId: '0QCM752BDQ9L5G5CAT0U',
    secretAccessKey: 'aeGUw3eCIHFN08bvKY08I6eBeP9lNsRBJFEve137',
    region: 'us-east-1',
    logger: console
});

//UUID
const { v4: uuidv4 } = require('uuid');

// Image processing
const sharp = require("sharp");

// Timekeeper
const tk = require("timekeeper")

// Global variables
const freeCapacity = 3000000000 /*3GB*/




/*__________________________ SETUP _____________________*/
// Set user storage data on signup
exports.setUserData = functions.auth.user().onCreate(async (user) => {

    // Setup user
    admin.firestore().collection('users').doc(user.uid).set({
        storage_capacity: freeCapacity,
        capacity_used: 0
    })

    return console.log(`Added storage info to user ${user.uid}.`)
})

// Add filesize
exports.set_storage = functions.firestore.document('users/{userId}/files/{docId}').onCreate(async (snap, context) => {

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
    const metaData = await s3.headObject({
        Bucket: functions.config().data.wasabi.bucket,
        Key: snap.data().storage_key
    }).promise();

    // Get file size from metadata
    const new_file_size_bytes = metaData.ContentLength

    // Update file size in file doc
    admin.firestore().collection('users').doc(context.params.userId).collection('files').doc(snap.id).update({
        size: new_file_size_bytes
    })

    //Get currently utilized data
    let storageDoc = await admin.firestore().collection('users').doc(context.params.userId).get()
    let capacity_used = storageDoc.data().capacity_used

    // Update storage doc
    admin.firestore().collection('users').doc(context.params.userId).update({
        capacity_used: capacity_used + new_file_size_bytes
    })

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



/*__________________________ SERVICES _____________________*/

// Sign upload url for Wasabi and create fileDoc
exports.signUploadUrl = functions.https.onCall((data, context) => {

    const uuid = uuidv4()
    const userId = context.auth.uid
    const nameArr = data.name.split('.')
    const extension = nameArr.pop()
    const key = `users/${userId}/${uuid}.${extension}`

    try {
        let url = s3.getSignedUrl('putObject', {
            Bucket: functions.config().data.wasabi.bucket,
            ContentType: data.contentType,
            ACL: 'private',
            Key: key
        });

        return {
            url: url,
            uuid: uuid,
            key: key
        }

    } catch (err) {
        console.log(err)
    }

});

// Check if Wasabi file exists
exports.checkWasabiFile = functions.https.onCall(async (data, context) => {

    try {

        const meta = await s3.headObject({
            Bucket: functions.config().data.wasabi.bucket,
            Key: data
        }).promise();

        return meta

    } catch (err) {
        return false
    }
})

// Get image thumbnail
exports.get_image_thumb = functions.https.onCall(async (data, context) => {

    const storage_key = data.storage_key
    const newThumbName = uuidv4()
    const gcsBucket = gcs.bucket(`${functions.config().data.wasabi.bucket}.appspot.com`);

    // 3. Save to file pipeline
    var file = gcsBucket.file(`users/${data.owner}/thumbnails/${newThumbName}.jpeg`).createWriteStream({ contentType: 'image/jpeg' })
        .on('error', (err) => { functions.logger.warn(err) })
        .on('finish', () => {
            // Write thumbnail to firestore
            admin.firestore().collection('users').doc(data.owner).collection('files').doc(data.id).update({
                thumbnail_key: `users/${data.owner}/thumbnails/${newThumbName}.jpeg`
            })
                .then(() => {
                    functions.logger.info('Thumbnail uploaded successfully.')
                })
                .catch((err) => functions.logger.error('Could not upload ....', data.owner, err))
        });

    // 2. Resize
    const pipeline = sharp();
    pipeline.resize(450, 450).jpeg({
        quality: 50
    }).pipe(file);

    // 1. Stream file from Wasabi
    s3.getObject({
        Bucket: 'cardboard-dev',
        Key: storage_key
    }).createReadStream().pipe(pipeline);
})

// Get signed download url
exports.sign_wasabi_download_url = functions.https.onCall(async (data, context) => {

    // Prevent non owners to access non shared files
    /*if (data.storage_key.split('/')[1] !== context.auth.uid) {
        // Get user doc
        let userDoc = await admin.firestore().collection('users').doc(data.owner).collection('files').doc(data.id).get()
        let file = userDoc.data()

        if(!file.share_id) return 'Access denied'
    }*/

    // round the time to the last 10-minute mark
    const getTruncatedTime = () => {
        const currentTime = new Date();
        const d = new Date(currentTime);

        d.setMinutes(Math.floor(d.getMinutes() / 10) * 60);
        d.setSeconds(0);
        d.setMilliseconds(0);

        return d;
    };

    // Cache-friendly signing
    try {
        const url = tk.withFreeze(getTruncatedTime(), () => {
            return s3.getSignedUrl(
                "getObject",
                {
                    Bucket: functions.config().data.wasabi.bucket,
                    Key: data.storage_key,
                    Expires: 21600
                }
            );
        });

        return url

    } catch (err) {
        functions.logger.error(err)
    }

})


/*__________________________ COMPUTE ENGINE _____________________*/

// Start Compute Engine
async function start_compute_engine() {

    //Get blockers
    const autoStartInstance = await admin.firestore().collection('settings').doc('blockers').get()

    if (autoStartInstance.data().autoStartInstance === true) {

        // Define instance
        var zone = compute.zone('asia-east1-a')
        var vm = zone.vm('instance-main')

        await vm.start((err, operation, apiResponse) => {

            if (err !== null) {
                console.log(err)
            } else {
                console.log('instance start successfully')
            }

        })
        return

    } else {

        return console.log('Instance auto start has been blocked')
    }
}

// Stop Compute Engine
exports.stopComputeEngine = functions.https.onRequest(async (request, response) => {

    // Check credentials
    if (request.body.credentials === httpCred) {

        // Define instance
        var zone = compute.zone('asia-east1-a')
        var vm = zone.vm('instance-main')

        console.log('Attempting to stop instance')

        // Stop instance
        await vm.stop((err, operation, apiResponse) => {
            if (err !== null) {
                return response.send('ERROR: ' + err)
            } else {
                return response.send('The instance has been successfully stopped.')
            }
        })
    } else {
        console.log('Insufficient permissions for this http request')
        return response.send('Insufficient permissions for this http request')
    }

})


//_/_/_/_/_/_/_/_/_/_/_/_/______________ DANGER ZONE ____________/_/_/_/_/_/_/_/_/_/_/_/_//

// Delete Files trigger
exports.delete_trigger = functions.firestore.document('users/{userId}/files/{docId}').onDelete(async (snap, context) => {

    // STORAGE UPDATE: Check if document counts against storage
    /*if (snap.data().type === 'video' && snap.data().isRaw === false) {

        // Do nothing

    } else {*/

    //Get stored data
    let storageDoc = await admin.firestore().collection('users').doc(context.params.userId).get()
    let capacity_used = storageDoc.data().capacity_used

    // Update storage doc
    admin.firestore().collection('users').doc(context.params.userId).update({
        capacity_used: capacity_used - snap.data().size
    })

    //}

    // Remove file from Wasabi
    await s3.deleteObject({
        Bucket: functions.config().data.wasabi.bucket,
        Key: snap.data().storage_key
    }).promise()

    // Remove thumbnail from GCS
    if (snap.data().thumbnail_key) {
        const bucket = gcs.bucket(functions.config().data.wasabi.bucket + ".appspot.com");
        await bucket.file(snap.data().thumbnail_key).delete()
    } else {
        console.log('No thumbnail')
    }

    // Check for and remove transcoded child
    if (snap.data().transcoded_child_id) {
        const transcoded_child = await admin.firestore().collection('users').doc(snap.data().owner).collection('files').doc(snap.data().transcoded_child_id).get()
        if (transcoded_child.exists) {
            await admin.firestore().collection('users').doc(snap.data().owner).collection('files').doc(snap.data().transcoded_child_id).delete()
        }
    } else {
        console.log('No transcoded child')
    }

    // Check for and remove source file
    if (snap.data().source_file_id) {
        const sourceDoc = await admin.firestore().collection('users').doc(snap.data().owner).collection('files').doc(snap.data().source_file_id).get()
        if (sourceDoc.exists) {
            admin.firestore().collection('users').doc(snap.data().owner).collection('files').doc(snap.data().source_file_id).delete()
        }
    } else {
        console.log('No source file')
    }
})