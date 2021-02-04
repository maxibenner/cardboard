import React from "react";
import styles from "./styles.module.css";

function ArrowText(props){

    const {text,fontStyle,variant} = props

    var variantText = styles.textDark;
    var variantIcon = styles.arrowDark;

    if(variant === "light"){
        variantText = styles.textLight;
        variantIcon = styles.arrowLight;
    }
    
    return(
        <div className={`${styles.element} ${styles[fontStyle]} ${variantText}`}>{text}<i className={`${styles.arrow} ${styles.right} ${variantIcon}`}></i></div>
    );
}

export default ArrowText;