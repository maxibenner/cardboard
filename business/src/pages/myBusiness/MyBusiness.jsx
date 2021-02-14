import React, { useState } from "react";
import Menu from "../../components/menu/Menu";
import firebase from "../../lib/firebase";
import styles from "./styles.module.css";

import Input from "../../components/input/Input";
//import LogoPicker from "../../components/logoPicker/LogoPicker";
//import ThemePicker from "../../components/themePicker/ThemePicker";
import ButtonFilled from "../../components/buttonFilled/ButtonFilled";

function MyBusiness(props) {
    const [name, setName] = useState(null);
    const [logo, setLogo] = useState(null);
    const [color, setColor] = useState(null);

    // Data changes
    const handleNameChange = (value) => {
        value === "" ? setName(null) : setName(value);
    };
    // const handleLogoChange = (value) => {
    //     setLogo(value);
    // };
    // const handleColorChange = (value) => {
    //     /^([0-9A-F]{3}){1,2}$/i.test(value) ? setColor(value) : setColor(null);
    // };

    // Submit
    const handleSubmit = () => {
        console.log(name, logo, color);
        if (name && logo && color) {
            if (
                window.confirm(
                    `The name of your business can not be changed in the future. Please confirm that you want to use "${name}" as your permanent business name.`
                )
            ) {
                firebase
                    .functions()
                    .httpsCallable("create_business")({
                        name: name,
                        color: color,
                    })
                    .then((data) => {
                        console.log(data);
                        if (data.code === 200) {
                            
                            // Refresh auth token
                            firebase.auth().currentUser.getIdToken(true).then(()=>{
                                //Upload image
                                console.log("uploading image now")
                            })
                        }else{

                        }
                    });
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
                    <Input
                        grey
                        type="text"
                        placeholder="Name your business"
                        label="Business Name"
                        required
                        onChange={(value) => handleNameChange(value)}
                    />
                </div>
                {/*<div className={styles.card}>
                    <h3>Brand elements</h3>
                    <p className={styles.sub}>
                        Customise the look of the Cardboard customer platform.
                    </p>
                    <hr />
                    <LogoPicker onChange={(value) => handleLogoChange(value)} />
                    <ThemePicker
                        onChange={(value) => handleColorChange(value)}
                    />
                </div>
                <div className={styles.card}>
                    <h3>Domain</h3>
                    <p style={{ fontWeight: 500 }}>Default</p>
                    <p>{`www.${
                        name ? name.toLowerCase() + "." : ""
                    }cardboard.video`}</p>
                </div>*/}
                <div className={styles.buttonContainer}>
                    <ButtonFilled
                        onClick={handleSubmit}
                        thin
                        textContent="Save"
                    />
                </div>
            </div>
        </div>
    );
}

export default MyBusiness;
