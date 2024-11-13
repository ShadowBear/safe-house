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
} from "firebase/firestore";

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
    // const pwDataObject = {
    //   avatar: pwData.avatar,
    //   title: pwData.title,
    //   pwData: credentials,
    //   id: pwData.id,
    // };
    //console.log(pwDataObject);

    const pwDataCollectionRef = collection(
      db,
      "users",
      user.uid,
      "pwDataCollection"
    );

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
    const pwDataCollectionRef = collection(
      db,
      "users",
      userId,
      "pwDataCollection"
    );
    const querySnapshot = await getDocs(pwDataCollectionRef);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  } catch (error) {
    console.error("All documents returned error: ", error);
  }

  //Getting single doc
  try {
    const pwDataDocRef = doc(db, "users", userId, "pwDataCollection", id);
    const docSnapshot = await getDoc(pwDataDocRef);
    if (docSnapshot.exists())
      console.log("Single Doc Data: ", docSnapshot.data());
    else console.log("No such document!");
  } catch (error) {
    console.error("Single document returned error: ", error);
  }
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
