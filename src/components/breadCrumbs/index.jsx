import React from "react";
import styles from './styles.module.css';
import { IoMdArrowDropright } from 'react-icons/io'

export default function BreadCrumbs(props) {

    // Create array from path
    const splitPathArray = props.path.split('/')
    // Filter out folders with length = 0
    const folderArray = splitPathArray.filter(el => { return el.length !== 0 && el })

    // Create new path
    const handleClick = (index) => {

        // Set path to root when click on home element
        if (index === false) {
            return props.handlePath('/')
        }

        // Discard subfolders
        const newArray = folderArray.slice(0, index + 1)

        // Turn into path and add leading and trailing slashes
        const newPath = `/${newArray.join('/')}/`

        // Set path state of parent element
        props.handlePath(newPath)

    }


    return (

        <div className={styles.breadCrumbContainer}>
            {folderArray.length > 0 &&
                // Hide home when not inside a folder
                <>
                    <p onClick={() => handleClick(false)} className={styles.breadCrumb}>{'Home'}</p>
                    <IoMdArrowDropright />
                </>
            }

            {folderArray.map((folder, index) => {

                // Hide if only element is root
                if (folderArray.length > 0) {
                    return (
                        <div
                            onClick={() => handleClick(index)}
                            key={index}
                            className={styles.breadCrumbContainer}
                        >
                            <p className={styles.breadCrumb}>
                                {folder}
                            </p>
                            {
                                // Hide arrow after last breadcrumb
                                index !== (folderArray.length - 1)
                                &&
                                <IoMdArrowDropright />
                            }
                        </div>
                    )
                } else {
                    return <p></p>
                }

            })}
        </div>

    );
}