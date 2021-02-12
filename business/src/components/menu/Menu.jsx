import React, { useContext } from "react";
import NavLinkIcon from "../navLinkIcon/NavLinkIcon";
import {
    MdPeople,
    MdSecurity,
    MdViewQuilt,
    MdPayment,
    MdBusiness,
    MdSettings,
} from "react-icons/md";
import styles from "./styles.module.css";
import { AuthContext } from "../../contexts/Auth";

function Menu(props) {
    const currentUser = useContext(AuthContext);
    const idToken = currentUser.getIdTokenResult();
    return (
        <div className={styles.container}>
            <NavLinkIcon
                to="/dashboard"
                icon={<MdViewQuilt />}
                text="Dashboard"
                disabled={idToken.claims ? false : true}
            />
            <div className={styles.spacer} />
            <NavLinkIcon
                to="/customers"
                icon={<MdPeople />}
                text="Customers"
                disabled={idToken.claims ? false : true}
            />
            <div className={styles.spacer} />
            <NavLinkIcon
                to="/permissions"
                icon={<MdSecurity />}
                text="Permissions"
                disabled={idToken.claims ? false : true}
            />
            <div className={styles.spacer} />
            <NavLinkIcon
                to="/pricing"
                icon={<MdPayment />}
                text="Pricing"
                disabled={idToken.claims ? false : true}
            />
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
                disabled={idToken.claims ? false : true}
            />
        </div>
    );
}

export default Menu;
