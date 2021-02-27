import React, { useState } from "react";
import firebase from "../../lib/firebase";
import Menu from "../../components/menu/Menu";
import Card from "../../components/card/Card";
import styles from "./customers.module.css";
import Input from "../../components/input/Input";
import ButtonFilled from "../../components/buttonFilled/ButtonFilled";
import Divider from "../../components/divider/Divider";
import CustomerContainer from "../../containers/customerContainer/CustomerContainer";
import { validate_email, timestamp_to_date } from "../../helpers/tools";
import { MdArrowForward } from "react-icons/md";
import { AnimatePresence } from "framer-motion";

function Customers() {
    const [input, setInput] = useState(null);
    const [searchPending, setSearchPending] = useState(false);
    const [createPending, setCreatePending] = useState(false);
    const [userRecord, setUserRecord] = useState(undefined);
    const [activeEmail, setActiveEmail] = useState("");

    const [modal, setModal] = useState(false);

    // Search database for user with matching email
    const handleSearch = (e) => {
        e.preventDefault();

        // Check if email is formatted correctly
        if (!validate_email(input))
            return window.alert("Please enter a valid email address.");

        // Show spinner
        setSearchPending(true);

        // Check if user exists
        firebase
            .functions()
            .httpsCallable("check_user_exists")({ email: input })
            .then((res) => {
                const exists = res.data.exists;

                setUserRecord(exists ? res.data.userRecord : false);
                setActiveEmail(input);
                setSearchPending(false);
            });
    };

    // Create new temporary customer
    const handleCreate = (e) => {
        e.preventDefault();

        // Check if email is formatted correctly
        if (!validate_email(input))
            return window.alert("Please enter a valid email address.");

        // Show spinner
        setCreatePending(true);

        // User setup
        firebase
            .functions()
            .httpsCallable("create_customer")({ email: input })
            .then((res) => {
                console.log(res.data);
                const exists = res.data.exists;

                setUserRecord(res.data.userRecord);
                setActiveEmail(input);
                setCreatePending(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div style={{ display: "flex" }}>
            <Menu />
            <div className={styles.container}>
                <h1 className={styles.title}>Customers</h1>
                <Card>
                    <h3>Find or create customers</h3>
                    <p>Find customers by searching for their email address.</p>
                    <form
                        onSubmit={(e) => handleSearch(e)}
                        style={{ width: "100%", display: "flex" }}
                    >
                        <Input
                            grey
                            placeholder="Customer email"
                            onChange={(value) => setInput(value)}
                        />
                        <ButtonFilled
                            pending={searchPending}
                            textContent="Search"
                            style={{ width: "100px", marginLeft: "10px" }}
                        />
                    </form>
                    {userRecord !== undefined && <Divider />}
                    {userRecord && (
                        <>
                            <div className={styles.headerContainer}>
                                <h3>Email</h3>
                                <h3>Created</h3>
                            </div>
                            <div
                                className={styles.userSearchCard}
                                onClick={() => setModal(true)}
                            >
                                <h3>{userRecord.email}</h3>
                                <p>
                                    {timestamp_to_date(
                                        userRecord.creation_time
                                    )}
                                    <MdArrowForward
                                        style={{ marginLeft: "5px" }}
                                    />
                                </p>
                            </div>
                        </>
                    )}
                    {userRecord === false && (
                        <form
                            onSubmit={(e) => handleCreate(e)}
                            style={{
                                margin: "30px 50px",
                                textAlign: "center",
                            }}
                        >
                            {"We couldn't find a customer connected to "}
                            <span style={{ fontWeight: "700" }}>
                                {activeEmail}
                            </span>
                            <ButtonFilled
                                pending={createPending}
                                style={{
                                    width: "200px",
                                    margin: "15px 50px 0 50px",
                                }}
                                textContent="Create new customer"
                            />
                        </form>
                    )}
                </Card>
            </div>
            <AnimatePresence>
                {modal && (
                    <CustomerContainer
                        userRecord={userRecord}
                        handleClose={() => setModal(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default Customers;
