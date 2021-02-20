import React, { createContext, useState, useEffect, useContext } from "react";
import firebase from "../lib/firebase";
import { AuthContext } from "./Auth";

export const DataContext = createContext(null);

export function DataProvider(props) {
    const { token } = useContext(AuthContext);
    const [businessDoc, setBusinessDoc] = useState(undefined);

    // Track auth state
    useEffect(() => {
        if (token) {
            firebase
                .firestore()
                .collection("businesses")
                .doc(token.claims.business)
                .onSnapshot(doc => {
                    setBusinessDoc(doc.data());
                });
        }
        return;
    }, [token]);

    return (
        <DataContext.Provider value={businessDoc}>
            {props.children}
        </DataContext.Provider>
    );
}
