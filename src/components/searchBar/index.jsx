import React, { useState, useRef, useEffect } from 'react'
import styles from './styles.module.css';

import { HiSearch } from 'react-icons/hi';

export default function SearchBar(props) {

    //__________ STATE __________//
    const [active, setActive] = useState(false)
    const [inputValue, setInputValue] = useState(null)


    //__________ REFERENCES __________//
    const input = useRef()


    // Remove placeholder text when active
    useEffect(() => {

        if (!active) { input.current.value = '' }
        if(active) {input.current.focus()}

    }, [active])

    // Handle submit
    const submit = (event) => {
        event.preventDefault()

        // Send submit value to parent onSubmit function
        props.onSubmit(inputValue)

        // Reset input text
        input.current.value = ''

    }


    //__________ CLASSES __________//
    const iconClasses = `${styles.searchIcon} ${active ? styles.searchIconActive : undefined}`

    return (
        <div className={`${styles.container} ${active && styles.containerActive}`} onClick={() => setActive(true)}>
            
            <div className={iconClasses}>
                <HiSearch />
            </div>
            <form className={styles.form} action="submit" onSubmit={(e)=>submit(e)}>
                <input
                    ref={input}
                    placeholder={props.placeholder}
                    onBlur={() => setActive(!active)}
                    onChange={(e)=>setInputValue(e.target.value)}
                    className={styles.input}
                    type='text' />
            </form>

        </div>
    )
}
