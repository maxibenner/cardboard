import React, { useState, useEffect, useRef } from "react";
import styles from "./styles.module.css";
import ContextToggle from '../contextToggle';
import Dropdown from '../dropdown';
import ButtonLight from '../buttonLight';
import { firebase } from '../../lib/firebase';
import { FaFolderMinus } from 'react-icons/fa';
import { MdTitle, MdFolder } from 'react-icons/md';
import folderIllustration from '../../media/illustrations/folder.svg';

export default function FolderCard(props) {

    // Input field
    const input = useRef(null)

    //Input state
    const [inputActive, setInputActive] = useState(false);
    const [title, setTitle] = useState(null)
    const [isHovered, setIsHovered] = useState(false)
    const [dragCounter, setDragCounter] = useState(0)
    const [menuActive, setMenuActive] = useState(false)



    // Handle file delete TODO: Adapt for folder
    const handleDelete = () => {
        /*firebase.firestore().collection('users').doc(props.owner).collection('files').doc(props.id).delete().then(() => {
            console.info('Deleted')
        }).catch((err) => console.err(err))*/
    }
    // Handle rename TODO: Adapt for folder
    const handleRename = (e) => {
        e.stopPropagation()
        //setInputActive(true)
    }
    // Handle change
    const handleChange = () => {
        setTitle(input.current.value)
    }
    // Handle focus loss
    const handleFocusLoss = (e) => {
        e.stopPropagation()
        setInputActive(false)
        firebase.firestore().collection('users').doc(props.owner).collection('files').doc(props.id).update({ name: title })
            .then(() => {
                console.info('Updated title')
            }).catch((err) => console.error(err))
    }
    // Handle title submit
    const handleKeyPress = (e) => {
        console.log('key')
        if (e.code === "Enter") {
            e.preventDefault();

            setInputActive(false)
            firebase.firestore().collection('users').doc(props.owner).collection('files').doc(props.id).update({ name: title })
                .then(() => {
                    console.info('Submitted title')
                }).catch((err) => console.error(err))
        }
    }

    // Set input focus
    useEffect(() => {
        if (inputActive) {
            input.current.focus()
            input.current.select()
        }
    }, [inputActive])


    //_____________________________DRAGGIN___________________________//
    // Handle drag enter
    const handleDragEnter = (e) => {
        setDragCounter(dragCounter => dragCounter + 1)
    }
    // Handle drag exit
    const handleDragLeave = () => {
        setDragCounter(dragCounter => dragCounter - 1)
    }
    // Handle drag drop
    const onDragDropFunctions = (e) => {

        setDragCounter(0)
        props.onDrop({
            id: props.id,
            display_type: 'folder',
            path: props.path
        })
    }
    // Handle drag over
    const handleDragOver = (e) => {
        e.preventDefault()
    }
    // Set drag state
    useEffect(() => {
        if (dragCounter === 0) {
            setIsHovered(false)
        } else {
            setIsHovered(true)
        }
    }, [dragCounter])

    //Get folder name from path
    useEffect(() => {

        //Get folder title
        props.path.slice()

        const elArray = props.path.split('/').filter((string) => {
            if (string.length !== 0) {
                return string
            } else return ''
        })

        const folderName = elArray.pop()

        setTitle(folderName)
    }, [props.path])



    return (
        <div className={`${styles.card} ${isHovered && styles.is_hovered}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={onDragDropFunctions}
        >
            <div className={styles.videoContainer} onClick={() => props.handleActiveFolder(props.path)}>

                <div className={styles.image}>
                    <img className={styles.thumbnailIllustration} alt={'folder illustration'} src={folderIllustration} />
                </div>

            </div>
            <div className={styles.body}>
                <div className={styles.main}>

                    <MdFolder className={styles.title_icon} />

                    {!inputActive ?
                        <p className={styles.title}>{title}</p>
                        :
                        <input
                            ref={input}
                            className={styles.titleInput}
                            type="text"
                            onKeyPress={handleKeyPress}
                            onChange={handleChange}
                            onBlur={handleFocusLoss}
                            defaultValue={title}
                        />
                    }
                </div>
                <ContextToggle onClick={() => setMenuActive(prevMenuActive => !prevMenuActive)}>
                    {
                        menuActive && <div className={styles.menuBackground} />
                    }
                    <Dropdown top small active={menuActive}>
                        <ButtonLight title={'Ungroup'} icon={<FaFolderMinus />} onClick={()=>props.handleUngroup(props.id)} />
                    </Dropdown>
                </ContextToggle>
            </div>
        </div>
    );

}



