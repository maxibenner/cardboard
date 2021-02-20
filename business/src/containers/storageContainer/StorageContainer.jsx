import React, { useState } from "react";
import firebase from "../../lib/firebase";
import Card from "../../components/card/Card";
import { useStripe } from "@stripe/react-stripe-js";
import ButtonFilled from "../../components/buttonFilled/ButtonFilled";

function StorageContainer(props) {
    const stripe = useStripe();

    // Track pending state of "activate button"
    const [activateBtnPending,setActivateBtnPending] = useState(false)

    const handleClick = () => {
        setActivateBtnPending(true)
        firebase
            .functions()
            .httpsCallable("create_checkout_session")({
                priceId: "price_1ILnMaFpZKBZ5KORZ11rYxJ2",
                href: window.location.href,
            })
            .then((res) => {
                console.log(res);
                stripe.redirectToCheckout({
                    sessionId: res.data.sessionId,
                });
            });
    };

    return (
        <Card>
            <h3>Storage</h3>
            <p>
                Activate pay-as-you-go billing to start delivering files to your
                customers.
            </p>
            <div style={{ width: "200px" }}>
                <ButtonFilled
                    pending={activateBtnPending}
                    thin
                    textContent="Activate"
                    onClick={handleClick}
                />
            </div>
        </Card>
    );
}

export default StorageContainer;
