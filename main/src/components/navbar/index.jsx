import React, { useContext, useEffect, useState } from "react";
import { BiBookHeart } from "react-icons/bi";
import { FiPackage } from "react-icons/fi";
import { HiOutlineLogout } from "react-icons/hi";
import { MdGroup, MdSettings } from "react-icons/md";
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import { FirebaseContext } from "../../context/firebase";
import { FileContext } from "../../context/FileContext";
import Logo from "../../media/logo-dark.svg";
import LogoLight from "../../media/logo-light.svg";
import ArrowText from "../arrow-text";
import ButtonLight from "../buttonLight";
import DropdownFull from "../dropdownFull";
import DeliveryContainer from "../../containers/deliveryContainer/DeliveryContainer";
import UserContext from "../userContext";
import styles from "./styles.module.css";

export default function Navbar(props) {
    const { firebase } = useContext(FirebaseContext);
    const files = useContext(FileContext);
    const [delivery, setDelivery] = useState([]);

    // Get files pending delivery
    useEffect(() => {
        if (files) {
            const pendingDelivery = files.filter(
                (el) => el.business !== undefined && el.delivery_status === "pending"
            );
            setDelivery(pendingDelivery);
        }
    }, [files]);

    const logout = () => {
        firebase.auth().signOut();
    };

    return (
        <div
            className={`${styles.nav} ${props.relative && styles.relative} 
                ${props.yellow && styles.yellow} 
                ${props.transparent && styles.transparent}
                `}
        >
            <div className={styles.container}>
                <div /*LINK to={props.to}*/>
                    <img
                        className={styles.logo}
                        src={props.light ? LogoLight : Logo}
                        alt="CardboardLogo"
                    />
                </div>

                <div className={styles.menuContainer}>
                    {!props.noauth && (
                        <>
                            <div className={styles.navMenuWide}>
                                {delivery.length !== 0 && (
                                    <DropdownFull
                                        down
                                        icon={
                                            <ButtonLight
                                                notification={delivery.length}
                                                icon={
                                                    <FiPackage
                                                        style={{
                                                            fontSize: "1.2rem",
                                                        }}
                                                    />
                                                }
                                                largeIcon
                                            />
                                        }
                                    >
                                        <DeliveryContainer
                                            delivery={delivery}
                                        />
                                    </DropdownFull>
                                )}

                                <Link as={Link} to={ROUTES.LIBRARY}>
                                    <ButtonLight title={"Library"} />
                                </Link>
                                <DropdownFull down icon={<UserContext />}>
                                    <Link as={Link} to={ROUTES.SETTINGS}>
                                        <ButtonLight
                                            title={"Settings"}
                                            icon={<MdSettings />}
                                        />
                                    </Link>
                                    <ButtonLight
                                        title={"Logout"}
                                        onClick={logout}
                                        icon={<HiOutlineLogout />}
                                    />
                                </DropdownFull>
                            </div>

                            <div className={styles.navMenuNarrow}>
                                <DropdownFull down icon={<UserContext />}>
                                    <Link as={Link} to={ROUTES.LIBRARY}>
                                        <ButtonLight
                                            title={"Library"}
                                            icon={<BiBookHeart />}
                                        />
                                    </Link>
                                    <Link as={Link} to={ROUTES.SETTINGS}>
                                        <ButtonLight
                                            title={"Settings"}
                                            icon={<MdSettings />}
                                        />
                                    </Link>
                                    <ButtonLight
                                        title={"Logout"}
                                        onClick={logout}
                                        icon={<HiOutlineLogout />}
                                    />
                                </DropdownFull>
                            </div>
                        </>
                    )}
                    {props.login && (
                        <div className={styles.navMenu}>
                            <Link to={ROUTES.SIGN_IN}>
                                <ArrowText text="Login" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
