import React, { useState, useEffect } from "react";
import Menu from "../../components/menu/Menu";
import styles from "./pricing.module.css";
import GradientPH from "../../components/gradientPH/GradientPH";
import PaymentPlans from "../../components/paymentPlans/PaymentPlans";
import firebase from "../../lib/firebase";
import Card from "../../components/card/Card";

import PaymentIntegration from "../../components/paymentIntegration/PaymentIntegration";

function Pricing(props) {
    // Keep track of pending states
    const [connectPending, setConnectPending] = useState(false);
    // Keep track of connection state
    const [stripeConnectionStatus, setStripeConnectionStatus] = useState(
        undefined
    );

    // Handle stripe connection
    const handleStripeConnection = async () => {
        setConnectPending(true);
        const res = await firebase
            .functions()
            .httpsCallable("get_stripe_account_link")({
            url: window.location.href,
        });
        window.location.href = res.data.url;
    };

    // Sync stripe connection state
    useEffect(() => {
        let isCancelled = false;
        firebase
            .functions()
            .httpsCallable("get_stripe_acc_data")()
            .then((res) => {
                if (res.data.code === 200) {
                    if (res.data.account.details_submitted) {
                        !isCancelled &&
                            setStripeConnectionStatus({
                                status: "active",
                                message: "Connected",
                                email: res.data.account.email,
                            });
                    } else {
                        !isCancelled &&
                            setStripeConnectionStatus({
                                status: "pending",
                                message: "Incomplete",
                                email: res.data.account.email,
                            });
                    }
                } else {
                    !isCancelled &&
                        setStripeConnectionStatus({
                            status: "inactive",
                            message: "Not connected",
                            email: null,
                        });
                }
            });

        return () => {
            isCancelled = true;
        };
    }, []);

    return (
        <div className={styles.wrapper}>
            <Menu />
            <div className={styles.container}>
                <h1 className={styles.title}>Pricing</h1>
                <Card>
                    {stripeConnectionStatus === undefined ? (
                        <GradientPH />
                    ) : (
                        <PaymentIntegration
                            connectPending={connectPending}
                            stripeConnectionStatus={stripeConnectionStatus}
                            handleStripeConnection={handleStripeConnection}
                        />
                    )}
                </Card>
                {/*<Card
                    inactive={
                        stripeConnectionStatus === undefined ||
                        stripeConnectionStatus.status !== "active"
                    }
                >
                    <h3>Subscription Pricing</h3>
                    <p style={{ marginBottom: "35px" }}>
                        Customise the subscription price of your customers. You
                        will earn half of all revenue exceeding the standard
                        price.
                    </p>
                    <PaymentPlans />
                </Card>*/}
            </div>
        </div>
    );
}

export default Pricing;
