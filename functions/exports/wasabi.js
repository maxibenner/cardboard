const { v4: uuidv4 } = require("uuid");
const tk = require("timekeeper");
const { admin, s3, functions } = require("../lib/init");

// Sign upload url for Wasabi and create fileDoc
exports.signUploadUrl = functions.https.onCall((data, context) => {
    const uuid = uuidv4();
    const userId = context.auth.uid;
    const nameArr = data.name.split(".");
    const extension = nameArr.pop();
    const key = `users/${userId}/${uuid}.${extension}`;

    try {
        let url = s3.getSignedUrl("putObject", {
            Bucket: functions.config().data.wasabi.bucket,
            ContentType: data.contentType,
            ACL: "private",
            Key: key,
        });

        return {
            url: url,
            uuid: uuid,
            key: key,
        };
    } catch (err) {
        console.log(err);
    }
});

// Sign upload url with custom uid sign_upload_url_business
exports.sign_upload_url_business = functions.https.onCall(
    async (data, context) => {
        // Early return
        // Lookup the user associated with the specified uid.
        const userRecord = await admin.auth().getUser(context.auth.uid);

        // The claims can be accessed on the user record.
        if (userRecord.customClaims.business) {
            const uuid = uuidv4();
            const owner_uid = data.owner_uid;
            const nameArr = data.name.split(".");
            const extension = nameArr.pop();
            const key = `users/${owner_uid}/${uuid}.${extension}`;

            let url = s3.getSignedUrl("putObject", {
                Bucket: functions.config().data.wasabi.bucket,
                ContentType: data.contentType,
                ACL: "private",
                Key: key,
            });

            return {
                code: 200,
                message: "Successfully created upload link.",
                url: url,
                uuid: uuid,
                key: key,
            };
        } else {
            return {
                code: 403,
                message: "You are not authorized to upload customer files.",
            };
        }
    }
);
// Check if Wasabi file exists
exports.checkWasabiFile = functions.https.onCall(async (data, context) => {
    try {
        const meta = await s3
            .headObject({
                Bucket: functions.config().data.wasabi.bucket,
                Key: data,
            })
            .promise();

        return meta;
    } catch (err) {
        return false;
    }
});

// Get signed download url
exports.sign_wasabi_download_url = functions.https.onCall(
    async (data, context) => {
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
            // Init url
            var url = null;

            // Get url with custom name or without
            if (data.name && data.suffix) {
                url = tk.withFreeze(getTruncatedTime(), () => {
                    return s3.getSignedUrl("getObject", {
                        Bucket: functions.config().data.wasabi.bucket,
                        Key: data.storage_key,
                        Expires: 21600,
                        ResponseContentDisposition: `attachment;filename="${data.name}.${data.suffix}"`,
                    });
                });
            } else {
                url = tk.withFreeze(getTruncatedTime(), () => {
                    return s3.getSignedUrl("getObject", {
                        Bucket: functions.config().data.wasabi.bucket,
                        Key: data.storage_key,
                        Expires: 21600,
                    });
                });
            }

            // Return signed download url
            return url;
        } catch (err) {
            functions.logger.error(err);
        }
    }
);
