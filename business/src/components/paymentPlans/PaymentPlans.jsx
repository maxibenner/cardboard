import React from "react";
import styles from "./paymentPlans.module.css";
import ClickableIcon from "../../components/clickableIcon/ClickableIcon";
import { MdEdit } from "react-icons/md";

function PaymentPlans(props) {
    // Handle new price
    const handleNewPrice = (capacity) => {
        window.prompt(`Set a new price for the ${capacity} GB plan.`);
    };

    return (
        <div>
            <table className={styles.table}>
                <tbody>
                    <tr>
                        <th>Plan</th>
                        <th>Price Floor</th>
                        <th>Custom Price</th>
                        <th>Margin</th>
                    </tr>
                    <tr></tr>
                    <tr className={styles.planCard}>
                        <td className={styles.roundLeft}>20 GB</td>
                        <td>$0.99</td>
                        <td className={styles.priceIconContainer}>
                            <div style={{ marginRight: "5px" }}>$0.99</div>
                            <ClickableIcon
                                onClick={() => handleNewPrice(20)}
                                icon={<MdEdit />}
                                color="var(--blue)"
                            />
                        </td>
                        <td>$0</td>
                    </tr>
                    <tr></tr>
                    <tr className={styles.planCard}>
                        <td>200 GB</td>
                        <td>$2.99</td>
                        <td className={styles.priceIconContainer}>
                            <div style={{ marginRight: "5px" }}>$2.99</div>
                            <ClickableIcon
                                onClick={() => handleNewPrice(200)}
                                icon={<MdEdit />}
                                color="var(--blue)"
                            />
                        </td>
                        <td>$0</td>
                    </tr>
                    <tr></tr>
                    <tr className={styles.planCard}>
                        <td>2000 GB</td>
                        <td>$12.99</td>
                        <td className={styles.priceIconContainer}>
                            <div style={{ marginRight: "5px" }}>$12.99</div>
                            <ClickableIcon
                                onClick={() => handleNewPrice(2000)}
                                icon={<MdEdit />}
                                color="var(--blue)"
                            />
                        </td>
                        <td>$0</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default PaymentPlans;
