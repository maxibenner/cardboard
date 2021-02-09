import React from "react";
import NavLinkIcon from "../navLinkIcon/NavLinkIcon";
import {
  MdPeople,
  MdSecurity,
  MdViewQuilt,
  MdPayment,
  MdEdit,
  MdSettings,
} from "react-icons/md";
import styles from "./styles.module.css";

function Menu(props) {
  return (
    <div className={styles.container}>
      <NavLinkIcon to="/dashboard" icon={<MdViewQuilt />} text="Dashboard" />
      <div className={styles.spacer} />
      <NavLinkIcon to="/customers" icon={<MdPeople />} text="Customers" />
      <div className={styles.spacer} />
      <NavLinkIcon to="/permissions" icon={<MdSecurity />} text="Permissions" />
      <div className={styles.spacer} />
      <NavLinkIcon to="/pricing" icon={<MdPayment />} text="Pricing" />
      <div className={styles.spacer} />
      <NavLinkIcon to="/customize" icon={<MdEdit />} text="Customize" />
      <div className={styles.spacer} />
      <NavLinkIcon to="/settings" icon={<MdSettings />} text="Settings" />
    </div>
  );
}

export default Menu;
