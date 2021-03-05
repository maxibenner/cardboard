import React, { useState, useContext } from "react";
import Menu from "../../components/menu/Menu";
import firebase from "../../lib/firebase";
import { AuthContext } from "../../contexts/Auth";
import styles from "./styles.module.css";

import Input from "../../components/input/Input";
import ButtonFilled from "../../components/buttonFilled/ButtonFilled";
import Card from "../../components/card/Card";
import StorageContainer from "../../containers/storageContainer/StorageContainer";
import Hint from "../../components/hint/Hint";

function MyBusiness(props) {
    const { token } = useContext(AuthContext);
    const [name, setName] = useState(null);
    const [businessPending, setBusinessPending] = useState(false);

    // Data changes
    const handleNameChange = (value) => {
        value === "" ? setName(null) : setName(value);
    };

    // Submit
    const handleSubmit = async () => {
        if (name /* && logo && color*/) {
            if (
                window.confirm(
                    `The name of your business can not be changed in the future. Please confirm that you want to use "${name}" as your permanent business name.`
                )
            ) {
                // Spinner
                setBusinessPending(true);

                // Database
                const data = await firebase
                    .functions()
                    .httpsCallable("create_business")({
                    name: name,
                    //color: color,
                });

                if (data.code === 200) {
                    console.log(data);
                    setBusinessPending(false);
                    // Refresh auth token
                    await firebase.auth().currentUser.getIdToken(true);
                    window.location.reload();
                } else {
                    console.log(data);
                    setBusinessPending(false);
                }
            }
        }
    };

    return (
        <div className={styles.wrapper}>
            <Menu />
            <div className={styles.container}>
                <h1 className={styles.title}>My Business</h1>
                <Card>
                    <h3>Info</h3>
                    {!token.claims.business ? <p>
                        Set the business name that will appear to your
                        customers.
                    </p>: <p>The name of your business.</p>}
                    {!token.claims.business ? (
                        <Input
                            grey
                            type="text"
                            placeholder="Name your business"
                            label="Business Name"
                            required
                            onChange={(value) => handleNameChange(value)}
                        />
                    ) : (
                        <div className={styles.emailContainer}>
                            <div className={styles.email}>
                                <p>{token.claims.business}</p>
                                <Hint textContent="This business identifier is permanent." />
                            </div>
                        </div>
                    )}
                </Card>
                {token.claims.business && <StorageContainer />}
                {!token.claims.business && (
                    <div className={styles.buttonContainer}>
                        <ButtonFilled
                            pending={businessPending}
                            onClick={handleSubmit}
                            textContent="Save"
                            disabled={name === null ? true : false}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyBusiness;
