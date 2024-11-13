import app from "./firebaseConfig";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/firestore";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const db = getFirestore(app);

export async function login(userName, password) {
  const auth = getAuth(app);
  try {
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      userName,
      password
    );
    const user = userCredentials.user;
    console.log("Logged in with user: ");
    console.log(user);
    return true;
  } catch (error) {
    console.log("Error: " + error.message);
    return false;
  }
}

export async function register(userName, password) {
  const auth = getAuth(app);
  try {
    await createUserWithEmailAndPassword(auth, userName, password);
    return true;
  } catch (error) {
    console.log("Error: " + error.message);
    return true;
  }
}

export async function addNewPwData(pwData) {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      userName: "Ben", //pwData.userName,
      password: "Password", //pwData.password,
      accounts: "dingens", //pwData.accounts,
      categories: "Moinsen", //pwData.categories,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding new doc: ", error);
  }

  // Simulate adding new password data request
  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve(true);
  //   }, 1000);
  // });
}

export async function getPwData(id) {
  // Simulate getting password data request
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
}

export async function deletePwData(id) {
  // Simulate deleting password data request
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
}

export async function updatePwData(id, pwData) {
  // Simulate updating password data request
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
}
