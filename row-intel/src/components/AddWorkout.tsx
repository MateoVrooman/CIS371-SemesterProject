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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormEvent } from "react";
import { Input } from "./ui/input";
import { useState } from "react";
import { logNewWorkout } from "@/lib/dbHelpers";
import { User } from "firebase/auth";

const AddWorkout = (props: { user: User }) => {
  const [workoutType, setWorkoutType] = useState<
    "row" | "erg" | "weights" | "cross training"
  >("row"); // Default to row
  const [distance, setDistance] = useState<number>(0);
  const [time, setTime] = useState<number>(0);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const workoutData = {};
    try {
      await logNewWorkout(props.user.uid, workoutData); // Add logNewWorkout function to lib
    } catch (err) {
      console.log("Error logging workout: ", err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-1/2 mx-auto my-auto">
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
          <div className="flex flex-col">
            <h3>Workout Type</h3>
            <Select
              onValueChange={(value) =>
                setWorkoutType(
                  value as "row" | "erg" | "weights" | "cross training"
                )
              }
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
            <h3>Distance</h3>
            <Input
              type="number"
              placeholder="Distance"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
            />
            <h3>Workout Time</h3>
            <Input
              type="time"
              placeholder="Time"
              value={time}
              onChange={(e) => setTime(Number(e.target.value))}
            />
          </div>
        </form>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="submit" variant="secondary">
              Submit
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddWorkout;
