import { useEffect, useState, useContext } from 'react';
import { FirebaseContext } from '../context/firebase';

export default function useContent(target) {
    const [content, setContent] = useState([]);
    const { firebase } = useContext(FirebaseContext);

    useEffect(() => {
        firebase
            .firestore()
            .collection("users")
            .doc("zGdHyxA4pcd453KFU7U0jexBiYz2")
            .collection(target)
            .get()
            .then((snapshot) => {
                const allContent = snapshot.docs.map((contentObj) => ({
                    ...contentObj.data(),
                    docId: contentObj.id
                }));

                setContent(allContent)
            })
            .catch((error) => {
                console.log(error.message)
            });
    }, []);

    return { [target]: content };
}