import auth from "./firebaseConfig";
import { app } from "./firebaseConfig";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/firestore";
import {
  getFirestore,
  collection,
  setDoc,
  addDoc,
  doc,
  getDocs,
  getDoc,
  deleteDoc,
} from "firebase/firestore";

const FIRESTORE_USERS = "users";
const FIRESTORE_PW_COLLECTION = "pwDataCollection";

const db = getFirestore(app);
const createPwDataObject = (pwData) => {
  const credentials = pwData.pwData
    .filter((instance) => instance)
    .map((instance) => Object.assign({}, instance));

  return {
    avatar: pwData.avatar,
    title: pwData.title,
    pwData: credentials,
    id: pwData.id,
  };
};

const getPwDataCollectionRef = (userId) => {
  return collection(db, FIRESTORE_USERS, userId, FIRESTORE_PW_COLLECTION);
};

const getPwDataDocRefWithId = (userId, pwDataId) => {
  return doc(db, FIRESTORE_USERS, userId, FIRESTORE_PW_COLLECTION, pwDataId);
};

export async function login(userName, password) {
  try {
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      userName,
      password
    );
    return true;
  } catch (error) {
    console.log("Error: " + error.message);
    return false;
  }
}

export async function register(userName, password) {
  try {
    await createUserWithEmailAndPassword(auth, userName, password);
    await sendEmailVerification(auth.currentUser);
    return true;
  } catch (error) {
    console.log("Error: " + error.message);
    return true;
  }
}

export async function logout() {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Logout failed: " + error.message);
    return false;
  }
}

export async function addNewPwData(pwData) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }

  try {
    const pwDataObject = createPwDataObject(pwData);
    const pwDataCollectionRef = getPwDataCollectionRef(user.uid);
    const pwDataDocRef = doc(pwDataCollectionRef, pwDataObject.id);
    await setDoc(pwDataDocRef, pwDataObject);
    // await addDoc(pwDataCollectionRef, pwDataObject);
    return true;
  } catch (error) {
    console.error("Error adding new doc: ", error);
    return false;
  }
}

export async function getAllPwData() {
  const userId = auth?.currentUser?.uid;
  if (!userId) throw new Error("User not authenticated");

  try {
    const pwDataCollectionRef = getPwDataCollectionRef(userId);
    const dataSnapshot = await getDocs(pwDataCollectionRef);
    let data = [];
    dataSnapshot.forEach((item) => {
      data.push(item.data());
      //console.log(item.id, "=>", item.data());
    });
    return data;
  } catch (error) {
    console.error("Error getting all docs: ", error);
  }
}

export async function getPwDataWithId(id) {
  const userId = auth?.currentUser?.uid;
  if (!userId) throw new Error("User not authenticated");

  //Getting single doc for id
  try {
    const pwDataDocRef = getPwDataDocRefWithId(userId, id);
    const docSnapshot = await getDoc(pwDataDocRef);
    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else console.log("No such document!");
  } catch (error) {
    console.error("Single document returned error: ", error);
  }
}

export async function deletePwData(id) {
  const userId = auth?.currentUser?.uid;
  if (!userId) {
    throw new Error("User not authenticated");
  }
  try {
    const docDataRef = getPwDataDocRefWithId(userId, id);
    await deleteDoc(docDataRef);
    return true;
  } catch (error) {
    console.error("Delete doc returned error: ", error);
    return false;
  }
}

export async function updatePwData(id, pwData) {
  const userId = auth?.currentUser?.uid;
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    const docDataRef = getPwDataDocRefWithId(userId, id);
    const pwDataObject = createPwDataObject(pwData);
    await setDoc(docDataRef, pwDataObject);
    return true;
  } catch (error) {
    console.error("Error updating Pw Data: ", error);
    return false;
  }
}
