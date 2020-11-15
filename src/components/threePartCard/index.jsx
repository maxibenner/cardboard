import React from 'react';
import styles from './styles.module.css';

export default function ThreePartCard(props) {

    const classes = `${styles.card} ${props.yellow ? styles.card_yellow:''}`

    return (
        <div className={classes} onClick={props.onClick}>
            <img className={styles.img} src={props.imgSrc} alt={props.imgAlt} />
            <p className={styles.title}>{props.title}</p>
            <p className={styles.sub}>{props.sub}</p>
        </div>
    );
} 