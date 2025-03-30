import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const logNewWorkout = async (uid: string, workoutData: object) => {
  console.log("Add workout to db");
  try {
    const workoutRef = doc(db, "workouts");
    await setDoc(workoutRef, workoutData);
  } catch (err) {
    console.log("Error adding new workout: ", err);
  }
};
