import React, { useContext } from "react";
import { AuthContext } from "../../contexts/Auth";
import styles from "./styles.module.css";
import { MdInfo } from "react-icons/md";

function BusinessBanner({ textContent }) {
    const { token } = useContext(AuthContext);
    return (
        <>
            {!token.claims.business ? (
                <>
                    <div className={`${styles.container} ${styles.floating}`}>
                        <div>
                            <div>
                                <MdInfo />
                            </div>
                            <p>{textContent}</p>
                        </div>
                    </div>
                    <div className={styles.container}>
                        <div>
                            <div>
                                <MdInfo />
                            </div>
                            <p>{textContent}</p>
                        </div>
                    </div>
                </>
            ) : null}
        </>
    );
}

export default BusinessBanner;
