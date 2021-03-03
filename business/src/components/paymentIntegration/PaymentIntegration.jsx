import React from "react";
import ButtonStripe from "../../components/buttonStripe/ButtonStripe";
import Status from "../../components/status/Status";
import ExternalLink from "../../components/externalLink/ExternalLink";
import styles from "./paymentIntegration.module.css";

function PaymentIntegration({ connectPending, stripeConnectionStatus, handleStripeConnection }) {
    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <h3>Payment Integration</h3>
                <Status statusObject={stripeConnectionStatus} />
            </div>
            {stripeConnectionStatus === undefined ||
            stripeConnectionStatus.status !== "active" ? (
                <div>
                    <p>
                        {stripeConnectionStatus !== undefined &&
                        stripeConnectionStatus.status === "inactive"
                            ? "To start accepting payments, you need to connect a Stripe account."
                            : "We still need some more information from you. Finish the setup to start accepting payments."}
                    </p>
                    <div style={{ width: "200px" }}>
                        <ButtonStripe
                            pending={connectPending ? true : false}
                            onClick={() => handleStripeConnection()}
                        />
                    </div>
                </div>
            ) : (
                <div>
                    <p>
                        Your Stripe account{" "}
                        <span style={{ fontWeight: "700" }}>
                            {stripeConnectionStatus.email}
                        </span>{" "}
                        is active and ready to collect payments.
                    </p>
                    <ExternalLink
                        href="https://dashboard.stripe.com/"
                        textContent="Stripe Dashboard"
                    />
                </div>
            )}
        </>
    );
}

export default PaymentIntegration;
