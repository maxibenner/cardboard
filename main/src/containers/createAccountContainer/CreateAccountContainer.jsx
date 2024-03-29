import React from "react";
import styles from "./createAccountContainer.module.css";
import Input from "../../components/input/Input";
import Hint from "../../components/hint/Hint";
import ButtonFilled from "../../components/buttonFilled/ButtonFilled";
import { CardElement } from "@stripe/react-stripe-js";
import { MdLock, MdClose } from "react-icons/md";
import { motion } from "framer-motion";

function CreateAccountContainer({ onClose, user }) {
    const handlePassword = () => {};

    return (
        <div className={styles.wrapper}>
            <motion.div
                className={styles.bg}
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
            />
            <motion.div
                className={styles.container}
                initial={{ transform: "translateY(70px)", opacity: 0 }}
                animate={{ transform: "translateY(0px)", opacity: 1 }}
                exit={{ transform: "translateY(70px)", opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 23 }}
            >
                <div className={styles.close} onClick={onClose}>
                    <MdClose />
                </div>
                <div className={styles.containerInner}>
                    <h2 className={styles.title}>Sign up</h2>
                    <p className={styles.sub}>
                        Create an acount and sign up for the appropriate storage
                        plan.
                    </p>
                    <div className={styles.emailContainer}>
                        <div className={styles.email}>
                            <p>{user.email}</p>
                            <Hint textContent="The email is preset to prevent strangers from claiming your files." />
                        </div>
                        <p className={styles.label}>Email</p>
                    </div>
                    <Input
                        type="password"
                        label="Password"
                        required
                        placeholder="Choose a password"
                        onChange={handlePassword}
                    />
                    <hr className={styles.divider} />
                    <div>
                        <div className={styles.planInner}>
                            <p>200GB</p>
                            <p>$2.99 / month</p>
                        </div>
                        <p className={styles.label}>Storage Plan</p>
                    </div>
                    <div className={styles.paymentContainer}>
                        <div className={styles.cardElementContainer}>
                            <CardElement
                                options={{
                                    style: {
                                        base: {
                                            fontSize: "16px",
                                            fontWeight: 300,
                                            backgroundColor: "#fff",
                                            fontFamily:
                                                "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Ubuntu, sans-serif",
                                            color: "#000",
                                            "::placeholder": {
                                                color: "#bdbdbd",
                                            },
                                        },
                                        invalid: {
                                            color: "#9e2146",
                                        },
                                    },
                                }}
                            />
                        </div>
                        <p className={styles.label}>
                            Credit or Debit Card<span>*</span>
                        </p>
                    </div>
                    <ButtonFilled
                        icon={<MdLock />}
                        bold
                        textContent={"Sign up & Transfer"}
                    />
                    <p className={styles.actionInfo}>
                        By clicking “Submit and pay”, you will be charged $2.99
                        immediately and $2.99 every month after that.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

export default CreateAccountContainer;
