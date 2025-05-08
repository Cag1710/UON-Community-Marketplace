import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFS8EQbXYw91sgPxaPf-eVnfVqpwBa7h4",
  authDomain: "uon-community-marketplac-44d37.firebaseapp.com",
  projectId: "uon-community-marketplac-44d37",
  storageBucket: "uon-community-marketplac-44d37.firebasestorage.app",
  messagingSenderId: "349797444141",
  appId: "1:349797444141:web:032b502fd7c8667e7ce6a4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
