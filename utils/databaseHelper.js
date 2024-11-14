import app from "./firebaseConfig";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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
  const auth = getAuth(app);
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
  const auth = getAuth(app);
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

    console.log("Document written with ID: ", pwDataDocRef.id);
  } catch (error) {
    console.error("Error adding new doc: ", error);
  }
}

export async function getPwData(id) {
  const auth = getAuth(app);
  const userId = auth?.currentUser?.uid;
  if (!userId) throw new Error("User not authenticated");

  //Getting all data docs
  try {
    const pwDataCollectionRef = getPwDataCollectionRef(userId);
    const querySnapshot = await getDocs(pwDataCollectionRef);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  } catch (error) {
    console.error("All documents returned error: ", error);
  }

  //Getting single doc
  try {
    const pwDataDocRef = getPwDataDocRefWithId(userId, id);
    const docSnapshot = await getDoc(pwDataDocRef);
    if (docSnapshot.exists())
      console.log("Single Doc Data: ", docSnapshot.data());
    else console.log("No such document!");
  } catch (error) {
    console.error("Single document returned error: ", error);
  }
}

export async function deletePwData(id) {
  const auth = getAuth(app);
  const userId = auth?.currentUser?.uid;
  if (!userId) {
    throw new Error("User not authenticated");
  }
  try {
    const docDataRef = getPwDataDocRefWithId(userId, id);
    await deleteDoc(docDataRef);
  } catch (error) {
    console.error("Delete doc returned error: ", error);
  }
}

export async function updatePwData(id, pwData) {
  const auth = getAuth(app);
  const userId = auth?.currentUser?.uid;
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    const docDataRef = getPwDataDocRefWithId(userId, id);
    const pwDataObject = createPwDataObject(pwData);
    await setDoc(docDataRef, pwDataObject);
    console.log("Pw Data updated successfully");
  } catch (error) {
    console.error("Error updating Pw Data: ", error);
  }
}
