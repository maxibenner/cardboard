import React, { createContext, useEffect, useState } from "react";
import { firebase } from "../lib/firebase";
import { useAuthListener } from "../hooks/use-auth-listener";

export const FileContext = createContext(null);

export function FileProvider({ children }) {
    const { user } = useAuthListener();
    const [files, setFiles] = useState(null);

    // Keep files in sync
    useEffect(() => {
        if(!user) return
        const listener = firebase
            .firestore()
            .collection("users")
            .doc(user.uid)
            .collection("files")
            .onSnapshot((snap) => {
                // For each file change
                const files = snap.docs.map((doc) => {
                    const file = doc.data();

                    //Add id to be used as react list key
                    file.id = doc.id;

                    return file;
                });
                setFiles(files);
            });
        return () => listener();
    }, [user]);

    return (
        <FileContext.Provider value={files}>{children}</FileContext.Provider>
    );
}
