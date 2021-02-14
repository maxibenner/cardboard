import React from "react";
import Navbar from "./components/navbar/Navbar";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Dashboard from "./pages/dashboard/Dashboard";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { AuthProvider } from "./contexts/Auth";
import { PrivateRoute, IsUserRedirect } from "./helpers/customRoutes";
import Customers from "./pages/customers/Customers";
import Permissions from "./pages/permissions/Permissions";
import Pricing from "./pages/pricing/Pricing";
import MyBusiness from "./pages/myBusiness/MyBusiness";
import Settings from "./pages/settings/Settings";
import BusinessBanner from "./components/businessBanner/BusinessBanner";

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
                        <Navbar />
                        <Dashboard />
                    </PrivateRoute>
                    <PrivateRoute exact path="/customers">
                        <Navbar />
                        <Customers />
                    </PrivateRoute>
                    <PrivateRoute exact path="/permissions">
                        <Navbar />
                        <Permissions />
                    </PrivateRoute>
                    <PrivateRoute exact path="/pricing">
                        <Navbar />
                        <Pricing />
                    </PrivateRoute>
                    <PrivateRoute exact path="/myBusiness">
                        <BusinessBanner
                            textContent="Before we get you started, please set up your
                                company profile."
                        />
                        <Navbar />
                        <MyBusiness />
                    </PrivateRoute>
                    <PrivateRoute exact path="/settings">
                        <Navbar />
                        <Settings />
                    </PrivateRoute>
                </Switch>
            </Router>
        </AuthProvider>
    );
}

export default App;
