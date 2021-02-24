import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Landing from "./pages/landing";
import Library from "./pages/library";
import Settings from "./pages/settings.jsx";
import Signin from "./pages/signin.jsx";
import Signup from "./pages/signup";
import * as ROUTES from "./constants/routes";
import { IsUserRedirect, ProtectedRoute } from "./helpers/routes";
import { useAuthListener } from "./hooks/use-auth-listener.js";
import { FileProvider } from "./context/FileContext";
import Share from "./pages/sh";

export default function App() {
    const { user } = useAuthListener();

    return (
        <FileProvider>
            <Router>
                <Route path={ROUTES.LANDING} exact>
                    <Landing />
                </Route>

                <Route path={ROUTES.SHARE} exact>
                    <Share />
                </Route>

                <IsUserRedirect
                    user={user}
                    path={ROUTES.SIGN_UP}
                    loggedInPath={ROUTES.LIBRARY}
                    exact
                >
                    <Signup />
                </IsUserRedirect>

                <IsUserRedirect
                    user={user}
                    path={ROUTES.SIGN_IN}
                    loggedInPath={ROUTES.LIBRARY}
                    exact
                >
                    <Signin />
                </IsUserRedirect>

                <ProtectedRoute user={user} path={ROUTES.LIBRARY} exact>
                    <Library />
                </ProtectedRoute>

                <ProtectedRoute user={user} path={ROUTES.SETTINGS} exact>
                    <Settings />
                </ProtectedRoute>
            </Router>
        </FileProvider>
    );
}
