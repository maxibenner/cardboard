import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../contexts/Auth";
import Spinner from "../components/spinner/Spinner";

export function PrivateRoute({ children }) {
    const { user, token } = useContext(AuthContext);

    return (
        <Route
            render={({ location }) => {
                switch (user) {
                    case undefined:
                        return (
                            <div
                                style={{
                                    display: "flex",
                                    width: "100%",
                                    height: "100vh",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Spinner />
                            </div>
                        );
                    case null:
                        return (
                            <Redirect
                                to={{
                                    pathname: "/",
                                    state: { from: location },
                                }}
                            />
                        );
                    default:
                        if (token) {
                            if (token.claims.business) return children;
                            else if (window.location.pathname !== "/myBusiness")
                                return (
                                    <Redirect
                                        to={{
                                            pathname: "/myBusiness",
                                            state: { from: location },
                                        }}
                                    />
                                );
                            else return children;
                        }
                }
            }}
        />
    );
}

export function IsUserRedirect({ loggedInPath, children }) {
    const { user, token } = useContext(AuthContext);
    return (
        <Route
            render={() => {
                if (!user) {
                    return children;
                }
                if (user) {
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
