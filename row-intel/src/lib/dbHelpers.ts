import {
  doc,
  addDoc,
  getDoc,
  collection,
  serverTimestamp,
  getDocs,
  orderBy,
  query,
  writeBatch,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { PlannedWorkout, SubmittedWorkout } from "@/lib/types";

export const logNewWorkout = async (
  userName: string,
  uid: string,
  workoutData: object,
  teamId: string
) => {
  console.log("Add workout to db");
  try {
    const workoutRef = collection(db, "users", uid, "workouts");
    const dataWithTime = {
      ...workoutData,
      timestamp: serverTimestamp(),
    };
    const teamWorkoutRef = collection(db, "teams", teamId, "workouts");
    const teamDataWithTime = {
      ...workoutData,
      userName: userName,
      timestamp: serverTimestamp(),
    };
    await addDoc(workoutRef, dataWithTime);
    await addDoc(teamWorkoutRef, teamDataWithTime);
    console.log("Workout added");
  } catch (err) {
    console.log("Error adding new workout: ", err);
  }
};

export const getTeam = async (uid: string) => {
  try {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData) {
        return userData.teamIds[0];
      }
    }
  } catch (error) {
    console.log("Error getting team: ", error);
  }
};

export const getName = async (uid: string) => {
  try {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData) {
        const name = userData.firstName + " " + userData.lastName;
        return name;
      }
    }
  } catch (error) {
    console.log("Error getting name: ", error);
  }
};

export const getUserWorkouts = async (uid: string) => {
  try {
    const workoutsRef = collection(db, "users", uid, "workouts");
    const q = query(workoutsRef, orderBy("timestamp", "desc"));
    const workoutsSnapshot = await getDocs(q);
    const workoutsData = workoutsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return workoutsData;
  } catch (error) {
    console.log("Error getting user workouts: ", error);
  }
};

export const getTeamWorkouts = async (teamId: string) => {
  try {
    const workoutsRef = collection(db, "teams", teamId, "workouts");
    const q = query(workoutsRef, orderBy("timestamp", "desc"));
    const workoutsSnapshot = await getDocs(q);
    const workoutsData = workoutsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return workoutsData;
  } catch (error) {
    console.log("Error getting team workouts: ", error);
  }
};

export const createTrainingPlan = async (
  teamId: string,
  planMetaData: object,
  workouts: PlannedWorkout[]
) => {
  try {
    const trainingPlansRef = collection(db, "trainingPlans");
    const docRef = await addDoc(trainingPlansRef, planMetaData);
    const workoutsRef = collection(
      db,
      "trainingPlans",
      docRef.id,
      "plannedWorkouts"
    );
    const batch = writeBatch(db);
    workouts.forEach((workout) => {
      // Add each workout to the batch as a separate document
      const workoutRef = doc(workoutsRef);
      batch.set(workoutRef, {
        ...workout,
        id: workoutRef.id, // Add the document ID to the workout data
        timestamp: serverTimestamp(),
      });
    });
    await batch.commit();
    return docRef;
  } catch (error) {
    console.error("Error creating training plan:", error);
  }
};

export const setActivePlan = async (teamId: string, planId: string) => {
  try {
    const teamRef = doc(db, "teams", teamId);
    await setDoc(teamRef, { activePlan: planId }, { merge: true });
    console.log("Active plan set successfully");
  } catch (error) {
    console.error("Error setting active plan:", error);
  }
};

export const getActivePlan = async (teamId: string) => {
  try {
    const teamRef = doc(db, "teams", teamId);

    const teamDoc = await getDoc(teamRef);
    const activePlanId = teamDoc.data()?.activePlan;
    const planRef = doc(db, "trainingPlans", activePlanId);
    const planDoc = await getDoc(planRef);
    const activePlanName = planDoc.data()?.name;
    return { id: activePlanId, name: activePlanName };
  } catch (error) {
    console.error("Error getting active plan:", error);
  }
};

export const getTrainingPlanWorkouts = async (planId: string) => {
  try {
    const trainingPlanRef = collection(
      db,
      "trainingPlans",
      planId,
      "plannedWorkouts"
    );
    const q = query(trainingPlanRef, orderBy("date", "desc"));
    const workoutsSnapshot = await getDocs(q);
    const workoutsData: PlannedWorkout[] = workoutsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        // include the document ID if needed
        ...(data as PlannedWorkout), // spread the rest of the fields assuming they match
      };
    });
    return workoutsData;
  } catch (error) {
    console.error("Error getting training plan workouts:", error);
  }
};

export const getPlannedWorkout = async (workoutId: string, planId: string) => {
  try {
    const workoutRef = doc(
      db,
      "trainingPlans",
      planId,
      "plannedWorkouts",
      workoutId
    );
    const workoutDoc = await getDoc(workoutRef);
    if (workoutDoc.exists()) {
      return workoutDoc.data();
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error getting planned workout:", error);
  }
};

export const submitPlannedWorkout = async (
  workoutId: string,
  planId: string,
  workoutData: SubmittedWorkout,
  userId: string,
  userName?: string,
  teamId?: string
) => {
  // Implement the function to submit planned workout
  try {
    const workoutRef = doc(
      db,
      "trainingPlans",
      planId,
      "submittedWorkouts",
      workoutId
    );
    const submissionRef = collection(
      db,
      "trainingPlans",
      planId,
      "submittedWorkouts",
      workoutId,
      "submissions"
    );
    const dataWithName = {
      ...workoutData,
      userName: userName,
      timestamp: serverTimestamp(),
    };
    const userRef = collection(db, "users", userId, "workouts");
    const dataWithTime = {
      ...workoutData,
      timestamp: serverTimestamp(),
    };
    const teamWorkoutRef = collection(db, "teams", teamId || "", "workouts");
    const teamDataWithTime = {
      ...workoutData,
      userName: userName,
      timestamp: serverTimestamp(),
    };
    await addDoc(userRef, dataWithTime);
    await addDoc(teamWorkoutRef, teamDataWithTime);
    await setDoc(workoutRef, workoutData);
    await addDoc(submissionRef, dataWithName);
    console.log("Workout submitted successfully");
  } catch (error) {
    console.error("Error submitting planned workout:", error);
  }
};

export const getSubmittedWorkouts = async (
  workoutId: string,
  planId: string
) => {
  try {
    const workoutRef = collection(
      db,
      "trainingPlans",
      planId,
      "submittedWorkouts",
      workoutId,
      "submissions"
    );
    const workoutDoc = await getDocs(workoutRef);
    return workoutDoc.docs.map(
      (doc) => ({ ...doc.data() } as SubmittedWorkout)
    );
  } catch (error) {
    console.error("Error getting submitted workout:", error);
  }
};
