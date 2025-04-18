import { useState } from "react";
import { WorkoutType, PlannedWorkout } from "@/lib/types"; // Assuming you have these types
import { Input } from "./ui/input";
import { Timestamp } from "firebase/firestore";

interface WorkoutBuilderProps {
  workouts: PlannedWorkout[];
  setWorkouts: React.Dispatch<React.SetStateAction<PlannedWorkout[]>>;
}

const WorkoutBuilder = ({ setWorkouts }: WorkoutBuilderProps) => {
  const [workoutType, setWorkoutType] = useState<WorkoutType>("row");
  const [distance, setDistance] = useState<number>();
  const [time, setTime] = useState<number>();
  const [pace, setPace] = useState<string>("");
  const [rpe, setRpe] = useState<number>(0);
  const [crossTrainingType, setCrossTrainingType] = useState<string>("");
  const [setsAndReps, setSetsAndReps] = useState<string>("");
  const [date, setDate] = useState("");

  const handleAddWorkout = () => {
    const dateVal = new Date(date);
    dateVal.setDate(dateVal.getDate() + 1);

    const newWorkout: PlannedWorkout = {
      id: "",
      workoutType,
      rpe,
      date: Timestamp.fromDate(dateVal),
    };

    if (workoutType === "row" || workoutType === "erg") {
      if (distance) newWorkout.distance = distance;
      if (time) newWorkout.time = time;
      if (pace) newWorkout.pace = pace;
    } else if (workoutType === "cross training") {
      newWorkout.crossTrainingType = crossTrainingType;
      newWorkout.distance = distance;
      newWorkout.time = time;
    } else if (workoutType === "weights") {
      newWorkout.setsAndReps = setsAndReps;
    }

    setWorkouts((prev) => [...prev, newWorkout]);
    console.log("New workout added: ", newWorkout);

    // Reset form
    setDistance(undefined);
    setTime(undefined);
    setPace("");
    setRpe(0);
    setCrossTrainingType("");
    setSetsAndReps("");
    setWorkoutType("row");
  };

  return (
    <div className="p-4 border rounded-xl bg-white mb-4">
      <h3 className="text-lg font-bold mb-2">Add a Workout</h3>

      <div className="mb-2">
        <label>Workout Type:</label>
        <select
          value={workoutType}
          onChange={(e) => setWorkoutType(e.target.value as WorkoutType)}
          className="border p-2 rounded w-full"
        >
          <option value="row">Row</option>
          <option value="erg">Erg</option>
          <option value="cross training">Cross Training</option>
          <option value="weights">Weights</option>
        </select>
      </div>

      {(workoutType === "row" || workoutType === "erg") && (
        <>
          <input
            type="number"
            placeholder="Distance (meters)"
            value={distance || ""}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="number"
            placeholder="Time (minutes)"
            value={time || ""}
            onChange={(e) => setTime(Number(e.target.value))}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="text"
            placeholder="Pace (optional)"
            value={pace}
            onChange={(e) => setPace(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
        </>
      )}

      {workoutType === "cross training" && (
        <>
          <input
            type="text"
            placeholder="Cross Training Type (Bike, Swim, etc.)"
            value={crossTrainingType}
            onChange={(e) => setCrossTrainingType(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="number"
            placeholder="Distance (meters)"
            value={distance || ""}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="number"
            placeholder="Time (minutes)"
            value={time || ""}
            onChange={(e) => setTime(Number(e.target.value))}
            className="border p-2 rounded w-full mb-2"
          />
        </>
      )}

      {workoutType === "weights" && (
        <input
          type="text"
          placeholder="Sets and Reps (e.g., 3x10, 4x8)"
          value={setsAndReps}
          onChange={(e) => setSetsAndReps(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
      )}

      <input
        type="number"
        placeholder="RPE (1-10)"
        value={rpe || ""}
        onChange={(e) => setRpe(Number(e.target.value))}
        className="border p-2 rounded w-full mb-2"
      />
      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="mb-2"
      />

      <button
        onClick={handleAddWorkout}
        className="bg-primary-darkBlue text-white p-2 rounded w-full"
      >
        Add Workout
      </button>
    </div>
  );
};

export default WorkoutBuilder;
