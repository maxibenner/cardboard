const { v4: uuidv4 } = require("uuid");
const tk = require("timekeeper");
const { s3, functions } = require("../lib/init");


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
            const url = tk.withFreeze(getTruncatedTime(), () => {
                return s3.getSignedUrl("getObject", {
                    Bucket: functions.config().data.wasabi.bucket,
                    Key: data.storage_key,
                    Expires: 21600,
                });
            });

            return url;
        } catch (err) {
            functions.logger.error(err);
        }
    }
);