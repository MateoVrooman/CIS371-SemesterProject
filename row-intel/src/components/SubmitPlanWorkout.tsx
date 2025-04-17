import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { FormEvent, useEffect, useState } from "react";
import { Input } from "./ui/input";
import {
  logNewWorkout,
  getTeam,
  getName,
  submitPlannedWorkout,
  getSubmittedWorkouts,
} from "@/lib/dbHelpers";
import { User } from "firebase/auth";
import ErgForm from "./addWorkoutForms/ErgForm";
import WeightsForm from "./addWorkoutForms/WeightsForm";
import CrossTrainForm from "./addWorkoutForms/CrossTrainForm";
import { useAuth } from "@/components/context/AuthContext";
import { PlannedWorkout, SubmittedWorkout, WorkoutType } from "@/lib/types";
import { getCoachStatus } from "@/lib/auth";

type AddWorkoutProps = {
  children: React.ReactNode;
  plannedWorkout: PlannedWorkout;
  activePlanId: string;
};

const SubmitPlanWorkout: React.FC<AddWorkoutProps> = ({
  children,
  plannedWorkout,
  activePlanId,
}) => {
  const [workoutType, setWorkoutType] = useState<WorkoutType>(
    plannedWorkout.workoutType
  );
  const [distance, setDistance] = useState<number>(
    plannedWorkout.distance || 0
  );
  const [time, setTime] = useState<number>(plannedWorkout.time || 0);
  const [pace, setPace] = useState<string>(plannedWorkout.pace || "");
  const [rpe, setRpe] = useState<number>(plannedWorkout.rpe || 0);
  const [setsReps, setSetsReps] = useState<string>(
    plannedWorkout.setsAndReps || ""
  );
  const [crossType, setCrossType] = useState<string>(
    plannedWorkout.crossTrainingType || ""
  );
  const [file, setFile] = useState<File | null>(null);
  const [isCoach, setIsCoach] = useState<boolean>(false);
  const [submittedWorkouts, setSubmittedWorkouts] = useState<
    SubmittedWorkout[]
  >([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const user = useAuth();
  if (!user) return null;

  useEffect(() => {
    const fetchRole = async () => {
      // Check if the user is a coach
      const isCoach = await getCoachStatus(user.uid);
      console.log("Is coach: ", isCoach);
      setIsCoach(isCoach);
    };
    fetchRole();
  }, [user]);

  const handleTrigger = async () => {
    if (isCoach) {
      const workouts = await getSubmittedWorkouts(
        plannedWorkout.id,
        activePlanId
      );
      if (!workouts) {
        console.log("No workouts found");
        return;
      } else {
        setSubmittedWorkouts(workouts);
      }
    }
  };

  const resetForm = () => {
    setWorkoutType("row");
    setDistance(0);
    setTime(0);
    setPace("");
    setRpe(0);
    setSetsReps("");
    setCrossType("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const workoutData: any = { workoutType };
    if (workoutType === "row" || workoutType === "erg") {
      workoutData.distance = distance;
      workoutData.time = time;
      if (pace) workoutData.pace = pace;
      workoutData.rpe = rpe;
    } else if (workoutType === "weights") {
      workoutData.setsReps = setsReps;
      workoutData.rpe = rpe;
    } else {
      workoutData.crossTrainingType = crossType;
      workoutData.time = time;
      workoutData.distance = distance;
      workoutData.rpe = rpe;
    }
    if (file) {
      workoutData.file = file;
    }
    try {
      const userName = await getName(user.uid);
      const teamId = await getTeam(user.uid);
      await submitPlannedWorkout(
        plannedWorkout.id,
        activePlanId,
        workoutData,
        user.uid,
        userName,
        teamId
      );
      resetForm();
    } catch (err) {
      console.log("Error logging workout: ", err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild onClick={handleTrigger}>
        {children}
      </DialogTrigger>
      {!isCoach ? (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Workout Results</DialogTitle>
            <DialogDescription>
              Enter workout details and attach any relevant documents
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <h3>Workout Type</h3>
            <Select
              onValueChange={(value) => setWorkoutType(value as WorkoutType)}
              defaultValue={plannedWorkout.workoutType}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Workout Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="row">Row</SelectItem>
                  <SelectItem value="erg">Erg</SelectItem>
                  <SelectItem value="weights">Weights</SelectItem>
                  <SelectItem value="cross training">Cross Training</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {workoutType === "row" || workoutType === "erg" ? (
              <ErgForm
                {...{
                  distance,
                  setDistance,
                  time,
                  setTime,
                  pace,
                  setPace,
                  rpe,
                  setRpe,
                }}
              />
            ) : workoutType === "weights" ? (
              <WeightsForm {...{ setsReps, setSetsReps }} />
            ) : (
              <CrossTrainForm
                {...{
                  crossType,
                  setCrossType,
                  time,
                  setTime,
                  distance,
                  setDistance,
                  rpe,
                  setRpe,
                }}
              />
            )}
            <h3>Attach File (optional)</h3>
            <Input type="file" onChange={handleFileChange} />
            <DialogFooter className="sm:justify-start mt-2">
              <DialogClose asChild>
                <Button type="submit" variant="secondary">
                  Submit
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      ) : (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Workout Submissions</DialogTitle>
            <DialogDescription>
              View submissions from your athletes and provide feedback
            </DialogDescription>
          </DialogHeader>
          {submittedWorkouts.map((workout, index) => (
            <div
              key={index}
              className="flex flex-row justify-evenly w-full mb-2 border-b"
            >
              {workout.userName + " - " || ""}
              {workout.distance + "m " || ""}
              {workout.time + "min " || ""}
              {workout.pace || ""}
              {workout.setsReps || ""}
              {workout.crossTrainingType || ""}
            </div>
          ))}
        </DialogContent>
      )}
    </Dialog>
  );
};

export default SubmitPlanWorkout;
