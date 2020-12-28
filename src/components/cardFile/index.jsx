import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./styles.module.css";
import ToggleContext from '../toggleContext';
import Dropdown from '../dropdown';
import ButtonLight from '../buttonLight';
import ButtonLightConfirm from '../buttonLightConfirm';
import { firebase } from '../../lib/firebase';
//import { RiScissorsFill } from 'react-icons/ri';
import { FaVideo } from 'react-icons/fa';
import { MdImage,/* MdAudiotrack, */MdLabel, MdTitle, MdDelete, MdPlayCircleFilled, MdShare } from 'react-icons/md';

export default function CardFile(props) {

    // Input field
    const input = useRef(null)

    //Input state
    const [inputActive, setInputActive] = useState(false);
    const [title, setTitle] = useState(props.file.name)
    const [menuActive, setMenuActive] = useState(false)

    const [draggable, setDraggable] = useState(true)
    const [isDragged, setIsDragged] = useState(false)

    // counter > 0 = is hovered
    const [dragCounter, setDragCounter] = useState(0)




    //_________________ FUNCTIONS _________________//

    // Handle file delete
    const handleDelete = useCallback(
        (e) => {
            firebase.firestore().collection('users').doc(props.file.owner).collection('files').doc(props.file.id).delete().then(() => {
                console.info('Deleted')
            }).catch((err) => console.err(err))
        }, [props.file.id, props.file.owner],
    )

    // Prevent default if necessary
    const preventDefault = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    // Handle rename
    const handleRename = useCallback(
        (e) => {
            e.stopPropagation()
            setMenuActive(false)
            setInputActive(true)
        }, [],
    )

    // Handle change
    const handleChange = useCallback(
        () => {
            setTitle(input.current.value)
        }, [],
    )

    // Handle focus loss
    const handleFocusLoss = useCallback(
        (e) => {
            e.stopPropagation()
            setInputActive(false)
            firebase.firestore().collection('users').doc(props.file.owner).collection('files').doc(props.file.id).update({ name: title })
                .then(() => {
                    console.info('Updated title')
                }).catch((err) => console.error(err))
        }, [props.file.owner, props.file.id, title],
    )

    // Handle title submit
    const handleKeyPress = useCallback(
        (e) => {
            console.log('key')
            if (e.code === "Enter") {
                e.preventDefault();

                setInputActive(false)
                firebase.firestore().collection('users').doc(props.file.owner).collection('files').doc(props.file.id).update({ name: title })
                    .then(() => {
                        console.info('Submitted title')
                    }).catch((err) => console.error(err))
            }
        }, [props.file.id, props.file.owner, title],
    )

    // Set input focus
    useEffect(() => {
        if (inputActive) {
            input.current.focus()
            input.current.select()
        }
    }, [inputActive])


    //_____________________________DRAGGIN___________________________//
    //Handle drag start
    const onDragStartFunctions = useCallback(
        () => {
            props.onDragStart(props.file.id)
            setIsDragged(true)
        }, [props],
    )

    // Handle drag enter
    const handleDragEnter = useCallback(
        (e) => {
            // Only set as target if not equal to source
            if (!isDragged) {
                setDragCounter(1)
            }
        }, [isDragged],
    )

    //Handle drag end
    const handleDragEnd = useCallback(
        (e) => {
            e.preventDefault()
            setIsDragged(false)
        }, [],
    )

    // Handle drag exit
    const handleDragLeave = useCallback(
        () => {
            // Only remove as target if not equal to source
            if (!isDragged) {
                setDragCounter(0)
            }
        }, [isDragged],
    )

    // Handle drag over
    const handleDragOver = useCallback(
        (e) => {
            e.preventDefault()
        }, [],
    )

    // Handle drag drop
    const onDragDropFunctions = useCallback(
        (e) => {
            setDragCounter(0)
            // Only trigger when target if not equal to source
            if (!isDragged) {
                props.onDrop({
                    id: props.file.id,
                    display_type: 'file'
                })
            }
        }, [isDragged, props],
    )



    return (
        <div
            className={`${styles.card} ${dragCounter !== 0 && styles.is_hovered} ${isDragged && styles.is_dragged}`}
            draggable={draggable}
            onDragStart={onDragStartFunctions}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragLeave={handleDragLeave}
            onDrop={onDragDropFunctions}
        >
            <div className={`${styles.cardInner} ${dragCounter !== 0 && styles.no_click}`}>
                <div className={styles.videoContainer} onClick={() => props.handleActiveMedia(props.file, 'show')}>
                    {!props.file.thumbnail_url && props.file.type === 'image' &&
                        <MdImage className={styles.processingButton} />
                    }
                    {!props.file.thumbnail_url && props.file.type === 'video' &&
                        <FaVideo className={styles.processingButton} />
                    }
                    {props.file.thumbnail_url && props.file.type === 'video' &&
                        <MdPlayCircleFilled className={styles.playButton} />
                    }
                    <div className={styles.image} style={props.file.thumbnail_url && { backgroundImage: `url(${props.file.thumbnail_url})` }}></div>
                </div>
                
                <div className={styles.body}>
                    <div className={styles.main}>

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

                    <ToggleContext onClick={() => setMenuActive(prevMenuActive => !prevMenuActive)}>
                        {
                            menuActive && <div className={styles.menuBackground} />
                        }
                        <Dropdown top small active={menuActive}>
                            <ButtonLight title={'Rename'} icon={<MdTitle />} onClick={handleRename} />
                            <ButtonLight title={'Label'} icon={<MdLabel />} onClick={() => props.handleActiveMedia(props.file, 'label')} />
                            <ButtonLight title={'Share'} icon={<MdShare />} onClick={() => window.alert("Sharing is not yet supported. Stay put.")} />
                            {/*props.file.type === 'video' && <ButtonLight title={'Split'} icon={<RiScissorsFill />} />*/}
                            <ButtonLightConfirm
                                danger
                                title={'Delete'}
                                icon={<MdDelete />}
                                onClick={(e) => preventDefault(e)}
                                confirmAction={handleDelete}
                                preventDrag={() => setDraggable(false)}
                                enableDrag={() => setDraggable(true)}
                            />
                        </Dropdown>
                    </ToggleContext>

                </div>
            </div>

        </div>
    );
}



