import React, { useContext, useState, useEffect } from "react";
import NavLinkIcon from "../navLinkIcon/NavLinkIcon";
import {
    MdFileUpload,
    MdPeople,
    MdSecurity,
    MdViewQuilt,
    MdPayment,
    MdBusiness,
    MdSettings,
} from "react-icons/md";
import styles from "./styles.module.css";
import { AuthContext } from "../../contexts/Auth";
import { UploaderContext } from "../../contexts/UploaderContext";

function Menu(props) {
    const { token } = useContext(AuthContext);
    const [businessClaim, setBusinessClaim] = useState(true);
    const [uploads, dispatchUpload] = useContext(UploaderContext);

    useEffect(() => {
        if (token) {
            if (token.claims.business) setBusinessClaim(false);
            else setBusinessClaim(true);
        }
    }, [token]);

    return (
        <div className={styles.container}>
            <NavLinkIcon
                to="/dashboard"
                icon={<MdViewQuilt />}
                text="Dashboard"
                disabled={businessClaim}
            />
            <div className={styles.spacer} />
            <NavLinkIcon
                to="/customers"
                icon={<MdPeople />}
                text="Customers"
                disabled={businessClaim}
            />
            <div className={styles.spacer} />
            <NavLinkIcon
                notification={uploads.length > 0 ? uploads.length : false}
                to="/uploads"
                icon={<MdFileUpload />}
                text="Uploads"
                disabled={businessClaim}
            />
            <div className={styles.spacer} />
            <NavLinkIcon
                to="/permissions"
                icon={<MdSecurity />}
                text="Permissions"
                disabled={businessClaim}
            />
            {/*<div className={styles.spacer} />
            <NavLinkIcon
                to="/pricing"
                icon={<MdPayment />}
                text="Pricing"
                disabled={businessClaim}
            />*/}
            <div className={styles.spacer} />
            <NavLinkIcon
                to="/myBusiness"
                icon={<MdBusiness />}
                text="My Business"
                disabled={false}
            />
            <div className={styles.spacer} />
            <NavLinkIcon
                to="/settings"
                icon={<MdSettings />}
                text="Settings"
                disabled={businessClaim}
            />
        </div>
    );
}

export default Menu;
