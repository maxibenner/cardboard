import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../contexts/Auth";
import MyBusiness from "../pages/myBusiness/MyBusiness";

export function PrivateRoute({ children }) {
    const currentUser = useContext(AuthContext);

    return (
        <Route
            render={({ location }) => {
                if(currentUser === undefined) {
                    return <div>TEst</div>
                }
                if (currentUser) {
                    const idToken = currentUser.getIdTokenResult();
                    if (idToken.claims !== undefined) {
                        return children;
                    } else {
                        if (window.location.pathname !== "/myBusiness") {
                            return (
                                <Redirect
                                    to={{
                                        pathname: "/myBusiness",
                                        state: { from: location },
                                    }}
                                />
                            );
                        } else {
                            return children;
                        }
                    }
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
                if(currentUser === undefined) {
                    return <div>TEst</div>
                }
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
