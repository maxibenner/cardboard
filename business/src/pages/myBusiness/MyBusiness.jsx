import React, { useState, useContext } from "react";
import Menu from "../../components/menu/Menu";
import firebase from "../../lib/firebase";
import { AuthContext } from "../../contexts/Auth";
import styles from "./styles.module.css";

import Input from "../../components/input/Input";
import ButtonFilled from "../../components/buttonFilled/ButtonFilled";

function MyBusiness(props) {
    const { user, token } = useContext(AuthContext);
    const [name, setName] = useState(null);
    // const [logo, setLogo] = useState(null);
    // const [color, setColor] = useState(null);

    // Data changes
    const handleNameChange = (value) => {
        value === "" ? setName(null) : setName(value);
    };

    // Submit
    const handleSubmit = async () => {
        if (name/* && logo && color*/) {
            if (
                window.confirm(
                    `The name of your business can not be changed in the future. Please confirm that you want to use "${name}" as your permanent business name.`
                )
            ) {
                const data = await firebase
                    .functions()
                    .httpsCallable("create_business")({
                    name: name,
                    //color: color,
                });
                console.log(data);
                if (data.code === 200) {
                    // Refresh auth token
                    await firebase.auth().currentUser.getIdToken(true);
                } else {
                    console.log(data);
                }
            }
        }
    };

    return (
        <div className={styles.wrapper}>
            <Menu />
            <div className={styles.container}>
                <h1 className={styles.title}>My Business</h1>
                <div className={styles.card}>
                    <h3>Info</h3>
                    <div className={styles.spacer} />
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
                        <div>{token.claims.business}</div>
                    )}
                </div>
                {!token.claims.business && (
                    <div className={styles.buttonContainer}>
                        <ButtonFilled
                            onClick={handleSubmit}
                            thin
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
