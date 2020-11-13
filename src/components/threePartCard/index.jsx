import React from 'react';
import styles from './styles.module.css';

export default function ThreePartCard(props){
    return (
        <div className={styles.card}>
            <img src={props.imgSrc} alt={props.imgAlt}/>
            <p className={styles.title}>{props.title}</p>
            <p className={styles.sub}>{props.sub}</p>
        </div>
    );
}