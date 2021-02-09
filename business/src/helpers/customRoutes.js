import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../contexts/Auth";

export function PrivateRoute({ children }) {
    const currentUser = useContext(AuthContext);

    return (
        <Route
            render={({ location }) => {
                if (currentUser) {
                    return children;
                }
                if (!currentUser) {
                    return (
                        <Redirect
                            to={{
                                pathname: "/",
                                state: { from: location },
                            }}
                        />
                    );
                }
                return null;
            }}
        />
    );
}

export function IsUserRedirect({ loggedInPath, children }) {
    const currentUser = useContext(AuthContext);
    return (
        <Route
            render={() => {
                if (!currentUser) {
                    return children;
                }
                if (currentUser) {
                    return (
                        <Redirect
                            to={{
                                pathname: loggedInPath,
                            }}
                        />
                    );
                }
                return null;
            }}
        />
    );
}
