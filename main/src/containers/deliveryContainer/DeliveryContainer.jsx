import React, { useState, useEffect } from "react";
import CardDelivery from "../../components/cardDelivery/CardDelivery";
import styles from "./deliveryContainer.module.css";
import { firebase } from "../../lib/firebase";

function DeliveryContainer({ delivery }) {
    // Get individual companies
    const [companies, setCompanies] = useState({});

    // Extract companies
    useEffect(() => {
        const newCompanies = {};

        delivery.forEach((element) => {
            // Push every company once (element.business)
            if (newCompanies[element.business]) {
                newCompanies[element.business].files++;
            } else {
                newCompanies[element.business] = { files: 1 };
            }
        });
        setCompanies(newCompanies);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [delivery]);

    // Handle actions
    const handleAccept = (businessName) => {
        const filesToAccept = [];
        const name = businessName.toLowerCase().replace(" ", "-")
        // Push file ids to array
        delivery.forEach((file) => {
            if (file.business === name.toLowerCase()) {
                filesToAccept.push(file.id);
            }
        });
        // Submit array to cloud function
        firebase.functions().httpsCallable("delivery_accept")({
            fileIds: filesToAccept,
            businessName: name,
        }).then(data=>console.log(data))
    };
    const handleDecline = (businessName) => {
        console.log("hihihi");
    };
    return (
        <div className={styles.deliveryContainer}>
            {Object.keys(companies).map((company) => {
                return (
                    <CardDelivery
                        company={company}
                        files={companies[company].files}
                        key={company}
                        onAccept={(name) => handleAccept(name)}
                        onDecline={(name) => handleDecline(name)}
                    />
                );
            })}
        </div>
    );
}

export default DeliveryContainer;
