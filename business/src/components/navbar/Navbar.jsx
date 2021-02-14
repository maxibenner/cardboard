import React, {useContext} from "react";
import UserButton from "../userButton/UserButton";
import styles from "./styles.module.css";
import firebase from "firebase";
import Dropdown from "../dropdown/Dropdown";
import ButtonLight from "../buttonLight/ButtonLight";
import { BiLogOut } from "react-icons/bi";
import { AuthContext } from "../../contexts/Auth";

function Navbar(props) {
    const {user, token} = useContext(AuthContext);
    return (
        <div className={styles.navbar}>
            <img className={styles.img} src="/logo.svg" alt="logo" />
            {user &&
                <Dropdown down icon={<UserButton />}>
                    <ButtonLight
                        onClick={() => firebase.auth().signOut()}
                        title="Logout"
                        icon={<BiLogOut />}
                    />
                </Dropdown>
            }
        </div>
    );
}

export default Navbar;
