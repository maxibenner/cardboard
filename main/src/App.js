import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import * as ROUTES from "./constants/routes";
import { FileProvider } from "./context/FileContext";
import { ProtectedRoute } from "./helpers/routes";
import { useAuthListener } from "./hooks/use-auth-listener.js";
import Delivery from "./pages/delivery";
import Landing from "./pages/landing";
import Library from "./pages/library";
import Settings from "./pages/settings.jsx";
import Share from "./pages/sh";
import { HelmetProvider } from "react-helmet-async";

const stripePromise = loadStripe(
  "pk_test_51HOSKAFpZKBZ5KORlFNJVqaRexGZQSliQ3rfiqAB69n7BaBE0OUp8KsLkFjGpz8PLsFlXv92pftjK8KP1vbLvNhy003eP7dhsl"
);

export default function App() {
  const { user } = useAuthListener();

  return (
    <HelmetProvider>
      <FileProvider>
        <Elements stripe={stripePromise}>
          <Router>
            <Route path={ROUTES.LANDING} exact>
              <Landing />
            </Route>

            <Route path={ROUTES.SHARE} exact>
              <Share />
            </Route>

            <Route path={ROUTES.DELIVERY} exact>
              <Delivery />
            </Route>

            <ProtectedRoute user={user} path={ROUTES.LIBRARY} exact>
              <Library />
            </ProtectedRoute>

            <ProtectedRoute user={user} path={ROUTES.SETTINGS} exact>
              <Settings />
            </ProtectedRoute>
          </Router>
        </Elements>
      </FileProvider>
    </HelmetProvider>
  );
}
