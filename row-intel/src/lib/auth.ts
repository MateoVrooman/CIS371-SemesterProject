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

    if (!user) {
      console.error("User is null after createUserWithEmailAndPassword");
      return { success: false, error: "User creation failed" };
    }

    console.log("Created user with email");

    const userData = {
      userId: user.uid,
      email,
      role,
      firstName,
      lastName,
    };

    await setDoc(doc(db, "users", user.uid), userData);
    console.log("Doc created in firestore");

    return user;
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
  return userCredential.user;
};
