import React, { useEffect, useState } from 'react';
import { firebase } from '../lib/firebase.dev';

function UserFiles(props){

    // Set default as null so we
    // know if it's still loading
    const [files, setFiles] = useState(null);

    // Initialize with listening to our
    // messages collection. The second argument
    // with the empty array makes sure the
    // function only executes once
    useEffect(() => {
        listenForFiles();
    }, [])

    // Use firestore to listen for changes within
    // our newly created collection
    function listenForFiles(){
        console.log('should onyl run once')
        firebase.firestore().collection('users').doc(props.uid).collection('files').onSnapshot(
            (snapshot) => {
                // Loop through the snapshot and collect
                // the necessary info we need. Then push
                // it into our array
                const allFiles = []
                snapshot.forEach((doc) => allFiles.push(doc.data()));
                console.log(allFiles)

                // Set the collected array as our state
                setFiles(allFiles);
                
            },
            (error) => console.error(error)
        );
    };

    // If the state is null we
    // know that it's still loading
    if (!files) {
        return <div>Loading...</div>
    }

    // Render all the messages with no
    // specific order
    const renderFiles = () => {
        // If the array is empty we inform
        // the user that there's no messages
        if (!files.length) {
            return <div>There are no files yet...</div>;
        };
        // Otherwise we'll render the messages.
        // Using index as key 🙈
        return files.map(({ original_name, type }, index) => (
            <div key={index}>
                <b>{original_name}</b>
                <div>{type}</div>
            </div>
        ));
    };
    // Render messages
    return renderFiles();
};

export default UserFiles;