import React, { createContext, useState, useEffect } from "react";
import firebase from "../lib/firebase";

export const AuthContext = createContext(null);

export function AuthProvider(props) {
    const [currentUser, setCurrentUser] = useState(undefined);

    firebase
        .auth()
        .onAuthStateChanged((currentUser) => setCurrentUser(currentUser));

    /*useEffect(()=>{
        console.log(currentUser)
    },[currentUser])*/

    return (
        <AuthContext.Provider value={currentUser}>
            {props.children}
        </AuthContext.Provider>
    );
}
