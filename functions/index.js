//Functions
const functions = require('firebase-functions')

//Admin
const admin = require('firebase-admin')

//Storage
const { Storage } = require('@google-cloud/storage');
const gcs = new Storage()

//Tasks
const { CloudTasksClient } = require('@google-cloud/tasks')

// Compute engine
const Compute = require('@google-cloud/compute')
const compute = new Compute()

//Init
admin.initializeApp()

// Stripe
const stripe = require('stripe')(functions.config().keys.stripe.sk)

//HTTP credential
const httpCred = 'h27d-x9f3-4j0s-23okv-fd9d'

// AW Wasabi
var AWS = require('aws-sdk');
const s3 = new AWS.S3({
    correctClockSkew: true,
    endpoint: 's3.us-east-1.wasabisys.com',
    accessKeyId: 'JB2PKLBI4BULKKE2WSRX',
    secretAccessKey: 'E4NFb1Cs2WhL7G04INbvhfwMvveU2kO8dbgLOmzQ',
    region: 'us-east-1',
    logger: console
});



// Global variables
const freeCapacity = 3000 /*3GB*/
const bundlePlanCapacity = 20000 /*20GB*/
const boxPlanCapacity = 200000 /*200GB*/
const bundleId = functions.config().keys.stripe.bundle_price
const boxId = functions.config().keys.stripe.box_price





/*__________________________ General _____________________*/

// Set user data on signup
exports.setUserData = functions.auth.user().onCreate(async (user) => {

    // Add storage doc to Firestore
    admin.firestore().collection('users').doc(user.uid).collection('info').doc('storage').set({
        capacity: 3000,
        stored: 0
    })

    // Add settings doc
    admin.firestore().collection('users').doc(user.uid).collection('info').doc('settings').set({
        addvideo: true
    })

    // Create Stripe customer
    const customer = await stripe.customers.create({
        email: user.email,
    })

    //Save to firestore
    admin.firestore().collection('users').doc(user.uid).collection('info').doc('stripe').set({
        customerId: customer.id
    })

    return console.log('Data set')
})

// Update storage doc
exports.updateStorageInfo = functions.firestore.document('users/{userId}/rawVideos/{docId}').onCreate(async (snap, context) => {

    //Get Wasabi storage metadata
    const params = {
        Bucket: functions.config().data.wasabi.bucket,
        Key: 'users/' + context.params.userId + '/rawVideos/' + context.params.docId
    }
    const metaData = await s3.headObject(params).promise();
    const sizeMb = metaData.ContentLength / 1000000

    //Get stored data
    let storageDoc = await admin.firestore().collection('users').doc(context.params.userId).collection('info').doc('storage').get()
    let stored = storageDoc.data().stored

    // Update storage doc
    admin.firestore().collection('users').doc(context.params.userId).collection('info').doc('storage').update({
        stored: stored + sizeMb
    })

    //Get pending data
    let pendingDoc = await admin.firestore().collection('users').doc(context.params.userId).collection('info').doc('pending').get()

    if (pendingDoc.exists) {

        let pendingVideos = pendingDoc.data().rawVideos

        // Add to user pending doc
        admin.firestore().collection('users').doc(context.params.userId).collection('info').doc('pending').update({
            rawVideos: pendingVideos + 1
        })
    } else {

        // Add to user pending doc
        admin.firestore().collection('users').doc(context.params.userId).collection('info').doc('pending').set({
            rawVideos: 1
        })
    }




    return 'Updated storage'

});

// Sign upload url
exports.signUploadUrl = functions.https.onCall((data, context) => {

    try {
        let url = s3.getSignedUrl('putObject', {
            Bucket: functions.config().data.wasabi.bucket,
            ContentType: data.contentType,
            ACL: 'private',
            Key: `${data.id}.${data.extension}`
        })
        return [url, `${data.id}.${data.extension}`]
    } catch (err) {
        console.log(err)
    }

});

// Sign download url
exports.signDownloadUrl = functions.https.onCall((data, context) => {

    console.log("users/" + context.auth.uid + "/scenes/" + data)
    try {
        let url = s3.getSignedUrl('getObject', {
            Bucket: functions.config().data.wasabi.bucket,
            Key: "users/" + context.auth.uid + "/scenes/" + data,
            Expires: 604800
        })
        return url
    } catch (err) {
        console.log(err)
    }

});


// Sign raw videodownload url
exports.signRawVideoDownloadUrl = functions.https.onCall((data, context) => {

    console.log("users/" + context.auth.uid + "/rawVideos/" + data)
    try {
        let url = s3.getSignedUrl('getObject', {
            Bucket: functions.config().data.wasabi.bucket,
            Key: "users/" + context.auth.uid + "/rawVideos/" + data
        })
        return url
    } catch (err) {
        console.log(err)
    }

});

//Delete tape
exports.deleteTape = functions.https.onCall(async (data, context) => {

    //Variables
    let tagsToBeRemoved = []

    //Get rawVideo doc
    let doc = await admin.firestore().collection('users').doc(context.auth.uid).collection('rawVideos').doc(data).get()
    console.log(doc.id)
    let d = doc.data()

    //Check if video has been processed
    if (d.status === 'processed') {

        //__________Delete thumbnails__________//
        for (let i = 0; i < d.thumbnails.length; i++) {

            //Get thumbnail id from array
            let id = d.thumbnails[i]

            //From Storage (WORKING)
            const bucket = gcs.bucket(functions.config().data.wasabi.bucket + ".appspot.com");
            const filePath = "users/" + context.auth.uid + "/thumbnails/" + id
            bucket.file(filePath).delete()

            //From Firestore (WORKING)
            admin.firestore().collection('users').doc(context.auth.uid).collection('thumbnails').doc(id).delete()

        }

        //__________Delete clips__________//
        for (let i = 0; i < d.clips.length; i++) {

            // Get clip id from array
            let id = d.clips[i]

            //From Wasabi (WORKING)
            await s3.deleteObject({
                Bucket: functions.config().data.wasabi.bucket,
                Key: 'users/' + context.auth.uid + '/scenes/' + id
            }).promise().then(async () => {

                //Get tags from all clips and add to tracker array
                await admin.firestore().collection('users').doc(context.auth.uid).collection('clips').doc(id).get().then((tagDoc) => {

                    // Add tag to Array of tags to be removed
                    if (tagDoc.data().tags) {
                        tagDoc.data().tags.forEach((tag) => {
                            tagsToBeRemoved.push(tag)
                        })
                    }

                })

                //From Firestore (WORKING)
                admin.firestore().collection('users').doc(context.auth.uid).collection('clips').doc(id).delete()
            })

        }

        //__________Delete tags__________//
        // Count number of each tag and save in object
        let count = {}
        tagsToBeRemoved.forEach((t) => {
            count[t] = (count[t] || 0) + 1
        })

        //Get current number of tag
        let rawDoc = await admin.firestore().collection('users').doc(context.auth.uid).collection('info').doc('tags').get()

        //Delete from Firestore info/tags document
        for (const [tag, number] of Object.entries(count)) {

            //Subtract from tag number
            if ((rawDoc.data()[tag] - number) < 1) {
                //Delete field
                admin.firestore().collection('users').doc(context.auth.uid).collection('info').doc('tags').update({
                    [tag]: admin.firestore.FieldValue.delete()
                })
            } else {
                //Subtract
                admin.firestore().collection('users').doc(context.auth.uid).collection('info').doc('tags').update({
                    [tag]: rawDoc.data()[tag] - number
                })
            }
        }

        //__________Delete tape__________//

        //From Wasabi (WORKING)
        await s3.deleteObject({
            Bucket: functions.config().data.wasabi.bucket,
            Key: 'users/' + context.auth.uid + '/rawVideos/' + doc.id
        }).promise().then(() => {

            // Free storage
            admin.firestore().collection('users').doc(context.auth.uid).collection('info').doc('storage').update({
                stored: admin.firestore.FieldValue.increment(-d.size)
            })

            // From Firestore (WORKING)
            admin.firestore().collection('users').doc(context.auth.uid).collection('rawVideos').doc(doc.id).delete()

        })

        return "Tape successfully deleted."

    } else {
        return 'Document has not yet been processed. Try again in 5 minutes.'
    }

})

// Check if file exists on wasabi
exports.checkWasabiFile = functions.https.onCall(async (data, context) => {

    try {

        const headCode = await s3.headObject({
            Bucket: functions.config().data.wasabi.bucket,
            Key: "users/" + context.auth.uid + "/rawVideos/" + data
        }).promise();

        return 'exists'

    } catch (err) {
        return err.code
    }

})


/*_____________________________ Social _________________________*/

//Set share directory
exports.setShareDir = functions.https.onCall(async (data, context) => {

    // Create document
    let sharedDoc = await admin.firestore().collection('public').doc('shared').collection('videos').doc(data.docName).set({
        title: data.title,
        description: data.description,
        year: data.year,
        docId: data.docId,
        videoUrl: data.videoUrl,
        userName: data.userName
    })

    return sharedDoc.id

})

//Sheduled delete (currently 7 days)
exports.sheduleShareDelete = functions.firestore.document('public/shared/videos/{id}').onCreate(async snapshot => {

    // Get the project ID from the FIREBASE_CONFIG env var
    const project = functions.config().data.wasabi.bucket
    const location = 'us-central1'
    const queue = 'cardboard-share'

    const expirationAtSeconds = Date.now() / 1000 + 604800
    const tasksClient = new CloudTasksClient()
    const queuePath = tasksClient.queuePath(project, location, queue)


    const url = `https://us-central1-${project}.cloudfunctions.net/sheduleShareDeleteCallback`
    const docPath = snapshot.ref.path
    const payload = {docPath:docPath}

    const task = {
        httpRequest: {
          httpMethod: 'POST',
          url,
          body: Buffer.from(JSON.stringify(payload)).toString('base64'),
          headers: {
            'Content-Type': 'application/json',
          },
        },
        scheduleTime: {
          seconds: expirationAtSeconds
        }
    }

    await tasksClient.createTask({ parent: queuePath, task })

    return
})

// Sheduled delete callback
exports.sheduleShareDeleteCallback = functions.https.onRequest(async (req, res) => {

    const payload = req.body
    console.log(payload)

    try {
        await admin.firestore().doc(payload.docPath).delete()
        res.send(200)
    }
    catch (error) {
        console.error(error)
        res.status(500).send(error)
    }

    return

})

/*_____________________________ Stripe _________________________*/

// Preview Proration
exports.previewProration = functions.https.onCall(async (data, context) => {

    // Set proration date to this moment:
    const proration_date = Math.floor(Date.now() / 1000);

    const subscription = await stripe.subscriptions.retrieve(data.sub);

    // See what the next invoice would look like with a price switch
    // and proration set:
    const items = [{
        id: subscription.items.data[0].id,
        price: data.price, // Switch to new price
    }];

    const invoice = await stripe.invoices.retrieveUpcoming({
        customer: data.cus,
        subscription: data.sub,
        subscription_items: items,
        subscription_proration_date: proration_date,
    });

    return invoice
})

// Update Subscription
exports.updateSubscription = functions.https.onCall(async (data, context) => {

    let userId = context.auth.uid
    let newPlanStorage

    // Retrieve subscription object
    const subscription = await stripe.subscriptions.retrieve(data.sub);

    // Get used storage
    let storageDoc = await admin.firestore().collection('users').doc(userId).collection('info').doc('storage').get()
    let usedStorage = storageDoc.data().stored

    // Get storage capacity of new plan and save to "newPlanStorage" variable
    if (data.price === bundleId) { newPlanStorage = bundlePlanCapacity }
    if (data.price === boxId) { newPlanStorage = boxPlanCapacity }

    console.log(data.price)
    console.log("Stored: " + usedStorage)
    console.log("New Plan Storage: " + newPlanStorage)

    // Check if user has too much data for downgrade
    if (usedStorage > newPlanStorage) {
        return {
            message: "remove_files",
            stored: usedStorage,
            capacity_after_downgrade: newPlanStorage
        }
    }

    // Create updated subscription
    const invoice = await stripe.subscriptions.update(data.sub, {
        cancel_at_period_end: false,
        proration_behavior: 'create_prorations',
        items: [{
            id: subscription.items.data[0].id,
            price: data.price,
        }]
    })

    // Get new plan name from invoice
    let newPlan = invoice.items.data[0].price.nickname

    // Update data
    if (newPlan === 'bundle') {

        // Update storage space
        admin.firestore().collection('users').doc(userId).collection('info').doc('storage').update({ capacity: bundlePlanCapacity })

        // Update plan
        await admin.firestore().collection('users').doc(userId).collection('info').doc('stripe').update({ plan: 'bundle', subscription: data.sub })
    }
    if (newPlan === 'box') {

        // Update storage space
        admin.firestore().collection('users').doc(userId).collection('info').doc('storage').update({ capacity: boxPlanCapacity })

        // Update plan
        await admin.firestore().collection('users').doc(userId).collection('info').doc('stripe').update({ plan: 'box', subscription: data.sub })
    }

    return invoice


})

// Create Subscription
exports.createStripeSubscription = functions.https.onCall(async (data, context) => {

    // Variables
    let userId = context.auth.uid

    //Get Stripe customer id
    var stripeDoc = await admin.firestore().collection('users').doc(context.auth.uid).collection('info').doc('stripe').get()
    var customerId = stripeDoc.data().customerId

    // Retrieve subscription
    const subscriptions = await stripe.subscriptions.list({ customer: customerId })

    // No active subscription
    if (subscriptions.data[0] === undefined || subscriptions.data[0].status === 'incomplete') {

        // Retrieve current payment method of user
        let paymentMethods = await stripe.paymentMethods.list({ customer: customerId, type: 'card' })

        // Delete previous payment method to prevent unused cards
        if (paymentMethods.data[0] !== undefined) {
            await stripe.paymentMethods.detach(paymentMethods.data[0].id)
        }

        // Attach the payment method to the customer
        try {
            await stripe.paymentMethods.attach(data.paymentMethodId, { customer: customerId, })
        } catch (err) {
            return { status: 'card_declined' }
        }

        // Update default paymentMethod
        await stripe.customers.update(customerId,
            {
                invoice_settings: {
                    default_payment_method: data.paymentMethodId,
                }
            })

        // Create the subscription
        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{ price: data.priceId }],
            expand: ['latest_invoice.payment_intent'],
        })

        // Update data
        if (data.planName === 'bundle') {

            // Update storage space
            admin.firestore().collection('users').doc(userId).collection('info').doc('storage').update({ capacity: bundlePlanCapacity })

            // Update plan
            await admin.firestore().collection('users').doc(userId).collection('info').doc('stripe').update({ plan: 'bundle' })
        }
        if (data.planName === 'box') {

            // Update storage space
            admin.firestore().collection('users').doc(userId).collection('info').doc('storage').update({ capacity: boxPlanCapacity })

            // Update plan
            await admin.firestore().collection('users').doc(userId).collection('info').doc('stripe').update({ plan: 'box' })
        }

        return {
            status: subscription.latest_invoice.payment_intent.status,
            clientSecret: subscription.latest_invoice.payment_intent.client_secret
        }

    } else {

        console.log(subscriptions.data[0])
        return { status: 'subscription_already_active' }

    }


})

// Cancel subscription
exports.cancelStripeSubscription = functions.https.onCall(async (data, context) => {

    let userId = context.auth.uid

    // Get used storage
    let storageDoc = await admin.firestore().collection('users').doc(userId).collection('info').doc('storage').get()
    let usedStorage = storageDoc.data().stored

    console.log("Stored: " + usedStorage)
    console.log("New Plan Storage: " + freeCapacity)

    // Check if user has too much data for downgrade
    if (usedStorage > freeCapacity) {
        return {
            message: "remove_files",
            stored: usedStorage,
            capacity_after_downgrade: freeCapacity
        }
    }

    try {
        var deleted = await stripe.subscriptions.del(data.sub)
    } catch (e) {
        console.log(e.code)
        return e.code
    }

    // Update storage space
    admin.firestore().collection('users').doc(userId).collection('info').doc('storage').update({ capacity: freeCapacity })

    // Update plan
    await admin.firestore().collection('users').doc(userId).collection('info').doc('stripe').update({
        plan: null,
        subscription: null,
        verified: false
    })

    return deleted

})

/*__________________________ Cloud Compute _____________________*/

// Start Compute Engine
exports.startComputeEngine = functions.firestore.document('pending/videos/initial/{doc}').onCreate(async (change, context) => {

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

})

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


//___________________________ENDPOINTS___________________________//

//Stripe invoice endpoint
exports.stripeInvoiceEvents = functions.https.onRequest(async (req, res) => {

    const endpointSecret = functions.config().keys.stripe.endpointsecret

    try {
        // Get the signature from the request header
        var sig = req.headers["stripe-signature"];
        // Verify the request against our endpointSecret
        var event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    } catch (err) {
        return res.status(200).send('invalid signature');
    }

    // Extract the object from the event.
    const dataObject = event.data.object;

    // Get user email and then id
    var userEmail = dataObject.customer_email
    var userRecord = await admin.auth().getUserByEmail(userEmail)
    var userId = userRecord.uid

    //Get subscription id
    var subId = dataObject.lines.data[0].subscription

    // Get plan name
    var plan = dataObject.lines.data[0].plan.nickname

    console.log(subId, plan)


    switch (event.type) {
        case 'invoice.paid':

            // Verify plan
            admin.firestore().collection('users').doc(userId).collection('info').doc('stripe').update({ verified: true })

            // Update data
            switch (plan) {

                // Bundle
                case 'bundle':

                    // Update storage space
                    admin.firestore().collection('users').doc(userId).collection('info').doc('storage').update({ capacity: bundlePlanCapacity })

                    // Update plan
                    admin.firestore().collection('users').doc(userId).collection('info').doc('stripe').update({ plan: 'bundle', subscription: subId })

                    break;

                // Box
                case 'box':

                    // Update storage space
                    admin.firestore().collection('users').doc(userId).collection('info').doc('storage').update({ capacity: boxPlanCapacity })

                    // Update plan
                    admin.firestore().collection('users').doc(userId).collection('info').doc('stripe').update({ plan: 'box', subscription: subId })

                    break;

                default:

                    return res.status(200).send('uncaught error');

            }
            // The status of the invoice will show up as paid. Store the status in your
            // database to reference when a user accesses your service to avoid hitting rate limits.
            break;

        case 'invoice.payment_failed':
            // If the payment fails or the customer does not have a valid payment method,
            //  an invoice.payment_failed event is sent, the subscription becomes past_due.
            // Use this webhook to notify your user that their payment has
            // failed and to retrieve new card details.

            break;
        default:
    }

    return res.status(200).send('success');

})

//Add to waitlist endpoint
exports.addToWaitlist = functions.https.onRequest(async (req, res) => {

    let email = req.query.email;

    // Add to waitlist
    await admin.firestore().collection('waitlist').doc(email).set({ timeOfCreation: Date.now() })

    res.header("Access-Control-Allow-Origin", "*");
    return res.send();

})

