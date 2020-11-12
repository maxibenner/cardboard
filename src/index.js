import React from 'react';
import 'normalize.css';
import { render } from 'react-dom';
import App from './app';
import { firebase } from './lib/firebase.dev';
import { FirebaseContext } from './context/firebase';

render(
    <>
        <FirebaseContext.Provider value={{ firebase }}>
            <App />
        </FirebaseContext.Provider>
    </>,
    document.getElementById('root')
);

