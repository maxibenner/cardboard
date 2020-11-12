import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Landing from './pages/landing';
import Home from './pages/home';
import Signin from './pages/signin.jsx';
import Signup from './pages/signup';
import * as ROUTES from './constants/routes';
import { IsUserRedirect, ProtectedRoute } from './helpers/routes';
import { useAuthListener } from './hooks/use-auth-listener.js';


export default function App() {

	const { user } = useAuthListener();

	return (
		<Router>

			<Route path={ROUTES.LANDING} exact>
				<Landing />
			</Route>
			
			<IsUserRedirect user={user} path={ROUTES.SIGN_UP} loggedInPath={ROUTES.HOME} exact>
				<Signup />
			</IsUserRedirect>

			<IsUserRedirect user={user} path={ROUTES.SIGN_IN} loggedInPath={ROUTES.HOME} exact>
				<Signin />
			</IsUserRedirect>

			<ProtectedRoute user={user} path={ROUTES.HOME} exact>
				<Home />
			</ProtectedRoute>
			
		</Router>
	);
}