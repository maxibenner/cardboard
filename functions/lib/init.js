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
const stripe = Stripe(functions.config().stripe.secret_key);

// Wasabi
var AWS = require("aws-sdk");
const s3 = new AWS.S3({
  correctClockSkew: true,
  endpoint: "s3.us-east-1.wasabisys.com",
  accessKeyId: functions.config().wasabi.access_key_id,
  secretAccessKey: functions.config().wasabi.secret_access_key,
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
