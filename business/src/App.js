import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import BusinessBanner from "./components/businessBanner/BusinessBanner";
import Navbar from "./components/navbar/Navbar";
import { AuthProvider } from "./contexts/Auth";
import { DataProvider } from "./contexts/Data";
import { UploaderProvider } from "./contexts/UploaderContext";
import { IsUserRedirect, PrivateRoute } from "./helpers/customRoutes";
import Customers from "./pages/customers/Customers";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/login/Login";
import MyBusiness from "./pages/myBusiness/MyBusiness";
import Permissions from "./pages/permissions/Permissions";
import Pricing from "./pages/pricing/Pricing";
import Settings from "./pages/settings/Settings";
import Signup from "./pages/signup/Signup";
import Uploads from "./pages/uploads/Uploads";

const stripePromise = loadStripe(
    "pk_test_51HOSKAFpZKBZ5KORlFNJVqaRexGZQSliQ3rfiqAB69n7BaBE0OUp8KsLkFjGpz8PLsFlXv92pftjK8KP1vbLvNhy003eP7dhsl"
);

function App() {
    return (
        <AuthProvider>
            <UploaderProvider>
                <Elements stripe={stripePromise}>
                    <DataProvider>
                        <Router>
                            <Switch>
                                <IsUserRedirect
                                    path="/"
                                    loggedInPath="/dashboard"
                                    exact
                                >
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
                                <PrivateRoute exact path="/uploads">
                                    <Navbar />
                                    <Uploads />
                                </PrivateRoute>
                            </Switch>
                        </Router>
                    </DataProvider>
                </Elements>
            </UploaderProvider>
        </AuthProvider>
    );
}

export default App;
