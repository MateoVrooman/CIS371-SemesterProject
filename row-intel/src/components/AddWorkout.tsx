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
import { FormEvent, useState } from "react";
import { Input } from "./ui/input";
import { logNewWorkout, getTeam, getName } from "@/lib/dbHelpers";
import { User } from "firebase/auth";
import ErgForm from "./addWorkoutForms/ErgForm";
import WeightsForm from "./addWorkoutForms/WeightsForm";
import CrossTrainForm from "./addWorkoutForms/CrossTrainForm";

type AddWorkoutProps = {
  user: User;
};

const AddWorkout: React.FC<AddWorkoutProps> = ({ user }) => {
  const [workoutType, setWorkoutType] = useState<string>("row");
  const [distance, setDistance] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [pace, setPace] = useState<string>("");
  const [rpe, setRpe] = useState<number>(0);
  const [setsReps, setSetsReps] = useState<string>("");
  const [crossType, setCrossType] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
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
    const workoutData: Record<string, any> = { workoutType };
    if (workoutType === "row" || workoutType === "erg") {
      workoutData.distance = distance;
      workoutData.time = time;
      if (pace) workoutData.pace = pace;
      workoutData.rpe = rpe;
    } else if (workoutType === "weights") {
      workoutData.setsReps = setsReps;
    } else if (workoutType === "cross training") {
      workoutData.crossType = crossType;
      workoutData.time = time;
      workoutData.distance = distance;
      workoutData.rpe = rpe;
    }
    if (file) {
      workoutData.file = file.name;
    }
    try {
      const userName = await getName(user.uid);
      const teamId = await getTeam(user.uid);
      await logNewWorkout(userName || "", user.uid, workoutData, teamId);
      resetForm();
    } catch (err) {
      console.log("Error logging workout: ", err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-fit ml-auto my-auto bg-primary-darkBlue rounded-full ">
          Log New Workout
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log New Workout</DialogTitle>
          <DialogDescription>
            Enter workout details and attach any relevant documents
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <h3>Workout Type</h3>
          <Select
            onValueChange={(value) => setWorkoutType(value)}
            defaultValue="row"
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
    </Dialog>
  );
};

export default AddWorkout;
