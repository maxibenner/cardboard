import React, { useState, useEffect } from "react";
import styles from './styles.module.css';
import CardFile from '../../components/cardFile';
import CardFolder from '../../components/cardFolder';
import BreadCrumbs from '../../components/breadCrumbs';



//______________________________ READ ME ______________________________//
// BrowserContainer requires the following props:
//
// 1. files[] -> An array contains each file as an object
//    Each file object has the following required keys:
//          id: Unique string
//          type: Either "video", "audio", "image", or "folder"
//
// 2. user -> Firebase user object containing the user id
//
// 3. firebase -> Initialized firebase instance
// 
// 4. handleActiveMedia: Callback function that handles the click of an element
//          Returns the storage key and the type of the clicked file
//
// Dependencies:
// - breadcrumbs
// - file element
// - folder element
//
// BrowserContainer works with a flat, keyed Firestore document structure


export default function BrowseContainer(props) {

    //_________________ STATES _________________//
    // Holds the id of the dragged element
    const [dragSource, setDragSource] = useState(null)
    // Holds the current path
    const [currentPath, setCurrentPath] = useState('/')



    //_________________ FUNCTIONS _________________//

    // Update current path through breadcrumbs
    const updateCurrentBreadcrumb = (path) => {
        setCurrentPath(path)
    }

    // Handle current path through folder click
    const updateCurrentFolder = (folder) => {
        setCurrentPath(folder)
    }

    // Keep track of dragged element
    const trackDragSource = (sourceId) => {
        setDragSource(sourceId)
    }

    // Update path of files
    const setNewFilePath = (dragTarget) => {

        if (dragTarget.display_type === 'file') {

            // Prompt for folder name
            const folderName = prompt("Name your new folder.", "New folder");

            // If success, set new file paths
            if (folderName) {
                props.firebase.firestore().collection('users').doc(props.user.uid).collection('files').doc(dragSource).update({ path: `${currentPath}${folderName}/` })
                props.firebase.firestore().collection('users').doc(props.user.uid).collection('files').doc(dragTarget.id).update({ path: `${currentPath}${folderName}/` })
            }
        } else {

            // Set new file path for dragged element
            props.firebase.firestore().collection('users').doc(props.user.uid).collection('files').doc(dragSource).update({ path: dragTarget.path })

        }
    }

    // Handle removing of folder
    const handleUngroup = (id) => {

        // Get folder to be unfoldered
        const folder = props.sortedElements.filter((element) => { return element.id === id })[0]

        // Create array from current path sections
        const currentPathLength = currentPath.split('/').filter((path) => { return path.length !== 0 }).length

        // Shorten and submit path
        folder.children.forEach((child) => {

            // Create array from file path sections
            const folderArray = child.path.split('/').filter((path) => { return path.length !== 0 })

            // Shorten folder array to one level after current path
            folderArray.splice(currentPathLength, 1)

            // Turn to string and set to "/" if in root
            let newPath = `/${folderArray.join('/')}/`
            if (newPath === '//') {
                newPath = '/'
            }

            // Update on firebase
            props.firebase.firestore().collection('users').doc(props.user.uid).collection('files').doc(child.id).update({ path: newPath })

        })

    }

    // Set visible files (folder logic)
    useEffect(() => {

        // Keep track of already existing folders
        const folderTracker = []

        // Add type to elements
        const elementsWithType = props.files.map((file) => {

            // Check if element exists at current path -> file
            if (file.path === currentPath) {

                // Add display_type to file
                file.display_type = 'file'

                return file

            } else {

                // Folder setup
                if (file.path.startsWith(currentPath) && file.path.split('/').length > currentPath.split('/').length) {

                    // Create array from current path sections
                    const currentPathLength = currentPath.split('/').filter((path) => { return path.length !== 0 }).length

                    // Create array from file path sections
                    const folderArray = file.path.split('/').filter((path) => { return path.length !== 0 })

                    // Shorten folder array to one level after current path
                    folderArray.length = currentPathLength + 1

                    const newFolderPath = `/${folderArray.join('/')}/`

                    // Create folder object
                    const folderObject = {
                        id: file.id,
                        owner: file.owner,
                        path: newFolderPath,
                        display_type: 'folder',
                        name: newFolderPath.split('/')[1],
                        children: [{
                            id: file.id,
                            path: file.path
                        }]
                    }

                    // Only add folder items once
                    const indexOfMatchingElement = folderTracker.findIndex(folder => folder.path === newFolderPath)
                    if (indexOfMatchingElement === -1) {

                        // Add to folder tracker
                        folderTracker.push(folderObject)

                        return folderObject

                    } else {

                        // Add as child
                        folderTracker[indexOfMatchingElement].children.push({
                            id: file.id,
                            path: file.path
                        })

                    }

                    return null
                }

                return null

            }

        })

        // Remove objects with value null from array
        const filteredElements = elementsWithType.filter((el) => {
            if (el) {
                return el
            } else {
                return null
            }
        })

        // Set visible files
        //setVisibleElements(filteredElements)

        // Send visible files back to home page
        props.handleVisibleElements(filteredElements)

    }, [props.files, currentPath])


    //_________________ RENDER _________________//
    return (
        <>
            <div className={styles.breadcrumbContainer}>
                <BreadCrumbs handlePath={updateCurrentBreadcrumb} path={currentPath} />
            </div>

            <div className={styles.container}>

                {props.sortedElements.map(file => {

                    // Only render files in the current path
                    if (file.display_type !== 'folder') {

                        return <CardFile
                            onDragStart={trackDragSource}
                            onDrop={setNewFilePath}
                            key={file.id}
                            file={file}
                            handleActiveMedia={props.handleActiveMedia}
                            handleModal={props.handleModal}
                        />

                    } else {

                        // Render folder once
                        return <CardFolder
                            key={file.id}
                            id={file.id}
                            path={file.path}
                            current_path={currentPath}
                            handleUngroup={handleUngroup}
                            handleActiveFolder={updateCurrentFolder}
                            onDrop={setNewFilePath}
                        />

                    }
                })}

            </div>
        </>
    );
} 