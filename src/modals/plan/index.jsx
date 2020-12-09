import React from 'react';
import styles from './styles.module.css';

import CardPlan from '../../components/cardPlan';
import Padding from '../../containers/padding';
import { IoMdCut } from 'react-icons/io';
import { MdSave, MdSearch } from 'react-icons/md';

export default function Plan(props) {

    // Upgrade
    const upgrade = (e) => {
        e.stopPropagation()
        window.alert("We currently don't offer upgrades. Until we do, you'll have unlimited storage.")
        props.onClick(null)
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.background} onClick={() => props.onClick(null)} />
            <Padding horizontal>
                <CardPlan
                    name={'Cardboard+'}
                    title={'$2.99'}
                    sub={'per month'}
                    body={'This plan offers enough storage for about 100 tapes or 10,000 photos.'}
                    features={[
                        {
                            key: 1,
                            icon: <MdSave />,
                            text: '200GB of storage'
                        },
                        {
                            key: 2,
                            icon: <IoMdCut />,
                            text: 'Tape Auto-Cutting'
                        },
                        {
                            key: 3,
                            icon: <MdSearch />,
                            text: 'Advanced Search'
                        }

                    ]}
                    onClick={(e)=>upgrade(e)}
                />
            </Padding>
        </div>
    );
}