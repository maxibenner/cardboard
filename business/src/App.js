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
import MyBusiness from "./pages/myBusiness/MyBusiness";
import Settings from "./pages/settings/Settings";
import Banner from "./components/banner/Banner";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Switch>
                    <IsUserRedirect path="/" loggedInPath="/dashboard" exact>
                        <Navbar />
                        <Login />
                    </IsUserRedirect>
                    <IsUserRedirect
                        exact
                        path="/signup"
                        loggedInPath="/dashboard"
                    >
                        <Navbar />
                        <Signup />
                    </IsUserRedirect>
                    <PrivateRoute exact path="/dashboard">
                        <Banner />
                        <Navbar />
                        <Dashboard />
                    </PrivateRoute>
                    <PrivateRoute exact path="/customers">
                        <Banner />
                        <Navbar />
                        <Customers />
                    </PrivateRoute>
                    <PrivateRoute exact path="/permissions">
                        <Banner />
                        <Navbar />
                        <Permissions />
                    </PrivateRoute>
                    <PrivateRoute exact path="/pricing">
                        <Banner />
                        <Navbar />
                        <Pricing />
                    </PrivateRoute>
                    <PrivateRoute exact path="/myBusiness">
                        <Banner />
                        <Navbar />
                        <MyBusiness />
                    </PrivateRoute>
                    <PrivateRoute exact path="/settings">
                        <Banner />
                        <Navbar />
                        <Settings />
                    </PrivateRoute>
                </Switch>
            </Router>
        </AuthProvider>
    );
}

export default App;
