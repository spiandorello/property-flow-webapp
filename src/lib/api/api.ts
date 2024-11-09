import axios, { AxiosInstance } from 'axios'

export const client: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8081',
  timeout: 1000,
})

//
// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries
//
// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
// 	apiKey: "AIzaSyAbv8k8HsZn72p1KOQQnMJBd7a3NTgHsd4",
// 	authDomain: "property-flow-36eb1.firebaseapp.com",
// 	projectId: "property-flow-36eb1",
// 	storageBucket: "property-flow-36eb1.firebasestorage.app",
// 	messagingSenderId: "155500109653",
// 	appId: "1:155500109653:web:094901a909593d4426d9dc",
// 	measurementId: "G-WZFRCSLQ8S"
// };
//
// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
