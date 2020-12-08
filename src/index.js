import React from 'react';
import 'normalize.css';
import { render } from 'react-dom';
import App from './App';
import { firebase } from './lib/firebase';
import { FirebaseContext } from './context/firebase';

render(
    //<React.StrictMode>
        <FirebaseContext.Provider value={{ firebase }}>
            <App />
        </FirebaseContext.Provider>
    //</React.StrictMode>
    ,
    document.getElementById('root')
);

