import React, { createContext, useState, useEffect } from "react";
import firebase from "../lib/firebase";

export const AuthContext = createContext(null);

export function AuthProvider(props) {
    const [currentUser, setCurrentUser] = useState(undefined);
    const [idToken, setIdToken] = useState(undefined);

    // Track auth state
    firebase.auth().onAuthStateChanged((currentUser) => {
        setCurrentUser(currentUser);
    });

    // Sync id token
    useEffect(() => {
        currentUser &&
            currentUser.getIdTokenResult().then((token) => setIdToken(token));
    }, [currentUser]);

    return (
        <AuthContext.Provider value={{ user: currentUser, token: idToken }}>
            {props.children}
        </AuthContext.Provider>
    );
}
