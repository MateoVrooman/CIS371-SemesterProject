// types.ts

import { Timestamp } from "firebase/firestore";

export type WorkoutType = "row" | "erg" | "cross training" | "weights";

export interface BaseWorkout {
  id: string; // Firestore doc ID
  workoutType: WorkoutType;
  timestamp: Timestamp; // or Firestore Timestamp if you prefer
  userName?: string; // Optional, for team workouts
  rpe: number; // Rate of perceived exertion
}

export interface RowOrErgWorkout extends BaseWorkout {
  workoutType: "row" | "erg";
  distance: number; // meters
  time: number; // e.g. "6:30"
  pace?: string; // optional, e.g. "1:45/500m"
  rpe: number; // Rate of perceived exertion
}

export interface CrossTrainingWorkout extends BaseWorkout {
  workoutType: "cross training";
  crossType: string; // e.g. "biking", "swimming"
  distance: number; // meters or miles
  time: number; // e.g. "45:00"
  rpe: number; // Rate of perceived exertion
}

export interface WeightsWorkout extends BaseWorkout {
  workoutType: "weights";
  setsReps: string; // e.g. "3x10 Squats, 3x8 Bench Press"
}

export interface PlannedWorkout {
  id: string; // Firestore doc ID
  workoutType: WorkoutType;
  distance?: number;
  time?: number;
  pace?: string;
  rpe: number;
  crossTrainingType?: string;
  setsAndReps?: string;
  date: Timestamp;
}

export interface SubmittedWorkout {
  workoutType: WorkoutType;
  distance?: number;
  time?: number;
  pace?: string;
  rpe: number;
  crossTrainingType?: string;
  setsReps?: string;
  file?: File | null; // optional, for file upload
  date: Timestamp;
  userId: string;
  userName: string;
  plannedWorkoutId: string; // Firestore doc ID
}

export interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
}

// Union type for ALL workouts
export type Workout = RowOrErgWorkout | CrossTrainingWorkout | WeightsWorkout;
