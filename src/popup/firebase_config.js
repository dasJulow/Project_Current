
import { initializeApp } from 'firebase/app'



// TODO Fill Me! 
// Find my details from Firebase Console

// config after registering firebase App 
const config = {
  apiKey: "AIzaSyAzUeU1l9kfi_cmo02t1BRM8waNw8xMQcE",
  authDomain: "affiliatelinksext.firebaseapp.com",
  projectId: "affiliatelinksext",
  storageBucket: "affiliatelinksext.appspot.com",
  messagingSenderId: "679100910256",
  appId: "1:679100910256:web:828467326b043b8835c975",

};

// This creates firebaseApp instance
// version: SDK 9
const firebaseApp = initializeApp(config)


export{
    firebaseApp
    
}