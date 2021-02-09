import React from "react";
import Navbar from "./components/navbar/Navbar";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Dashboard from "./pages/dashboard/Dashboard";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/Auth";
import { PrivateRoute, IsUserRedirect } from "./helpers/customRoutes";
import Customers from "./pages/customers/Customers";
import Permissions from "./pages/permissions/Permissions";
import Pricing from "./pages/pricing/Pricing";
import Customize from "./pages/customize/Customize";
import Settings from "./pages/settings/Settings";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Switch>
                    <IsUserRedirect path="/" loggedInPath="/dashboard" exact>
                        <Login />
                    </IsUserRedirect>
                    <IsUserRedirect
                        exact
                        path="/signup"
                        loggedInPath="/dashboard"
                    >
                        <Signup />
                    </IsUserRedirect>
                    <PrivateRoute exact path="/dashboard">
                        <Dashboard />
                    </PrivateRoute>
                    <PrivateRoute exact path="/customers">
                        <Customers />
                    </PrivateRoute>
                    <PrivateRoute exact path="/permissions">
                        <Permissions />
                    </PrivateRoute>
                    <PrivateRoute exact path="/pricing">
                        <Pricing />
                    </PrivateRoute>
                    <PrivateRoute exact path="/customize">
                        <Customize />
                    </PrivateRoute>
                    <PrivateRoute exact path="/settings">
                        <Settings />
                    </PrivateRoute>
                </Switch>
            </Router>
        </AuthProvider>
    );
}

export default App;
