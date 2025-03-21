import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const registerUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: "coach" | "athlete"
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    console.log("Created user with email");

    // Create user in Firestore
    await setDoc(doc(db, "users", user.uid), {
      userId: user.uid,
      email,
      role,
      firstName,
      lastName,
    });
    return { success: true, userId: user.uid };
  } catch (error) {
    console.error(error);
    return { success: false, error: (error as Error).message };
  }
};

export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return { uid: userCredential.user.uid, email: userCredential.user.email };
};
