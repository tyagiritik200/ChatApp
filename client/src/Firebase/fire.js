import firebase from 'firebase';
var firebaseConfig = {
    apiKey: "AIzaSyD8tjFtb2ggYahNqvUAuH_o3WbNzeKdthk",
    authDomain: "chatapp-6838e.firebaseapp.com",
    databaseURL: "https://chatapp-6838e.firebaseio.com",
    projectId: "chatapp-6838e",
    storageBucket: "chatapp-6838e.appspot.com",
    messagingSenderId: "26171603189",
    appId: "1:26171603189:web:1e2afd73f82e6096376dbc",
    measurementId: "G-73C3HBF20C"
  };
  // Initialize Firebase
const fire=firebase.initializeApp(firebaseConfig);

export default fire;


