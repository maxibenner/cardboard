import React from 'react';
import styles from './styles.module.css';
import Button from '../button';

export default function CardPlan(props) {

    const classes = `${styles.card} ${props.yellow ? styles.card_yellow : ''}`


    return (
        <div className={classes} onClick={props.onClick}>
            <p className={styles.name}>{props.name}</p>
            <p className={styles.title}>{props.title}</p>
            <p className={styles.sub}>{props.sub}</p>
            <div className={styles.features}>
                {props.features.map((feature) => {
                    return (
                        <div className={styles.feature} key={feature.key}>
                            {feature.icon}
                            <p className={styles.featureText}>{feature.text}</p>
                        </div>
                    )
                })}
            </div>
            <Button blue wide text={'Upgrade'} onClick={props.onClick} /> 

        </div>
    );
} 








/*const array = [
    {
        text: 'Placeholder',
        url: 'https://placeholder.com/source',
        className: 'class1'
    },
    {
        text: 'Placeholder',
        url: 'https://placeholder.com/source',
        className: 'class2'
    },
    {
        text: 'Placeholder',
        url: 'https://placeholder.com/source',
        className: 'class1'
    },
]


for (var i = 0; i < array.length; i++){

    const text = array[i].text
    const url = array[i].url
    const className = array.[i].className
}
*/













