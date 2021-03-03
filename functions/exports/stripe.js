const { admin, functions, stripe } = require("../lib/init");


// Create Connected account
exports.get_stripe_account_link = functions.https.onCall(
    async (data, context) => {
        // Check if business profile exists
        if (!context.auth.token.business)
            return { code: "500", message: "No registered business" };

        // Business doc ref
        const docRef = admin
            .firestore()
            .collection("businesses")
            .doc(context.auth.token.business);

        // Get business doc
        const businessDoc = await docRef.get();

        // New or updated stripe account link
        if (businessDoc.data().stripe_acc_id) {
            // Get one time account link
            const accountLinks = await stripe.accountLinks.create({
                account: businessDoc.data().stripe_acc_id,
                refresh_url: data.url,
                return_url: data.url,
                type: "account_onboarding",
            });

            return {
                code: 200,
                message: "Updated stripe account link",
                url: accountLinks.url,
            };
        } else {
            // Create account
            const account = await stripe.accounts.create({
                type: "standard",
            });

            // Write account id to firestore
            docRef.update({
                stripe_acc_id: account.id,
            });

            // Get one time account link
            const accountLinks = await stripe.accountLinks.create({
                account: account.id,
                refresh_url: data.url,
                return_url: data.url,
                type: "account_onboarding",
            });

            return {
                code: 200,
                message: "Created new stripe account link",
                url: accountLinks.url,
            };
        }
    }
);
// Get Stripe account status
exports.get_stripe_acc_data = functions.https.onCall(async (data, context) => {
    // Check if business/Stripe connection exists
    const businessDoc = await admin
        .firestore()
        .collection("businesses")
        .doc(context.auth.token.business)
        .get();
    if (!businessDoc.data().stripe_acc_id)
        return { code: "500", message: "Not connected" };

    // Get Stripe account data
    const account = await stripe.accounts.retrieve(
        businessDoc.data().stripe_acc_id
    );

    return {
        code: 200,
        message: "Retrieved account data",
        account: account,
    };
});
// Create checkout session
exports.create_checkout_session = functions.https.onCall(
    async (data) => {
        const { priceId, href } = data;

        // See https://stripe.com/docs/api/checkout/sessions/create
        // for additional parameters to pass.
        try {
            const session = await stripe.checkout.sessions.create({
                mode: "subscription",
                payment_method_types: ["card"],
                line_items: [
                    {
                        price: priceId,
                    },
                ],
                success_url: `${href}?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: href,
            });

            return {
                code: 200,
                message: "Successfully created session id",
                sessionId: session.id,
            };
        } catch (e) {
            return {
                code: 400,
                message: "Couldn't create session",
                message: e.message,
            };
        }
    }
); 