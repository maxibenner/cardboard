// Firebase
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Google Cloud
const Compute = require("@google-cloud/compute");
const compute = new Compute();

const { Storage } = require("@google-cloud/storage");
const gcs = new Storage();

// Stripe 
// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
const Stripe = require("stripe");
const stripe = Stripe(
    "sk_test_51HOSKAFpZKBZ5KOREnkNesFnOqriBc3wiNiH0QUtgz0YiWbjSCqVMVMkpVg8r5iuawXP1Mo2dcastNJueJnqDgPp00BChthLeL"
);

// Wasabi
var AWS = require("aws-sdk");
const s3 = new AWS.S3({
    correctClockSkew: true,
    endpoint: "s3.us-east-1.wasabisys.com",
    accessKeyId: "0QCM752BDQ9L5G5CAT0U",
    secretAccessKey: "aeGUw3eCIHFN08bvKY08I6eBeP9lNsRBJFEve137",
    region: "us-east-1",
    logger: console,
});

module.exports = {
    admin,
    compute,
    functions,
    gcs,
    s3,
    stripe,
};
