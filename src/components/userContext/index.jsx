import React, { useState } from 'react'
import styles from './styles.module.css'
import { IoMdArrowDropdown } from 'react-icons/io'
import Dropdown from '../dropdown'
import { useAuthListener } from '../../hooks/use-auth-listener'

export default function UserContext({ children }) {

    const [menuActive, setMenuActive] = useState()
    const { user } = useAuthListener();

    const userInitial = user.email.charAt(0).toUpperCase()


    return (
        <div className={styles.wrapper} onClick={() => setMenuActive(prev => !prev)}>
            <div className={styles.container}>
                <p className={styles.text}>{userInitial}</p>
            </div>
            <IoMdArrowDropdown />
            {
                menuActive && <div className={styles.menuBackground} />
            }
            <Dropdown active={menuActive} >
                {children}
            </Dropdown>
        </div>
    )
}
