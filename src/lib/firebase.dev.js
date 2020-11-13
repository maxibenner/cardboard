import Firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';

const config = {
    apiKey: "AIzaSyAxh0wQM2n3xHDz5oUHapJlo9X17G5Rs4M",
    authDomain: "cardboard-dev.firebaseapp.com",
    databaseURL: "https://cardboard-dev.firebaseio.com",
    projectId: "cardboard-dev",
    storageBucket: "cardboard-dev.appspot.com",
    messagingSenderId: "504688003980",
    appId: "1:504688003980:web:73514cb8971d53107624a9"
};

const firebase = Firebase.initializeApp(config);

export { firebase };