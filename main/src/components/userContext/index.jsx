import React from 'react'
import styles from './styles.module.css'
import { IoMdArrowDropdown } from 'react-icons/io'
import { useAuthListener } from '../../hooks/use-auth-listener'

export default function UserContext() {

    const { user } = useAuthListener();

    const userInitial = user.email.charAt(0).toUpperCase()


    return (
        <div className={styles.wrapper} >
            <div className={styles.container}>
                <p className={styles.text}>{userInitial}</p>
            </div>
            <IoMdArrowDropdown />
        </div>
    )
}
