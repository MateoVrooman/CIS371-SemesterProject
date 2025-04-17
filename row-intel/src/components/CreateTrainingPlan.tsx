"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { createTrainingPlan, getTeam, setActivePlan } from "@/lib/dbHelpers";
import WorkoutBuilder from "./WorkoutBuilder";
import { PlannedWorkout } from "@/lib/types";

export default function CreateTrainingPlan() {
  const user = useAuth();
  if (!user) {
    return <div>No user</div>;
  }
  const [teamId, setTeamId] = useState<string>("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [workouts, setWorkouts] = useState<PlannedWorkout[]>([]);
  const [makeActive, setMakeActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTeam = async () => {
      const team = await getTeam(user.uid);
      setTeamId(team);
    };
    fetchTeam();
  }, [user]);
  if (!teamId) {
    return <div>No team</div>;
  }

  async function handleCreatePlan() {
    if (!name || !startDate || !endDate) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const planMetaData = {
        name,
        description,
        coachId: user?.uid,
        teamId: teamId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        createdAt: new Date(),
      };
      console.log("Workouts: ", workouts);
      const docRef = await createTrainingPlan(teamId, planMetaData, workouts);
      if (!docRef) {
        alert("Failed to create training plan.");
        return;
      }
      if (makeActive) {
        setActivePlan(teamId, docRef.id);
      }

      router.push(`/dashboard`);
    } catch (error) {
      console.error("Error creating training plan:", error);
      alert("Failed to create training plan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardContent className="flex flex-col gap-4 px-6">
          <h1 className="text-2xl font-bold">Create Training Plan</h1>

          <Input
            placeholder="Plan Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Planned Workouts</h2>
            <WorkoutBuilder workouts={workouts} setWorkouts={setWorkouts} />
          </div>

          {workouts.length > 0 && (
            <div className="">
              <h3 className="text-lg font-semibold mb-2">Workouts Added:</h3>
              <ul className="space-y-2">
                {workouts.map((workout, index) => (
                  <li key={index} className="p-2 border rounded bg-gray-50">
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {workout.distance ? `${workout.distance}m ` : ""}
                        {workout.time ? ` ${workout.time}min ` : ""}
                        {workout.workoutType}
                        {workout.crossTrainingType
                          ? ` - ${workout.crossTrainingType}`
                          : ""}
                      </span>
                      {workout.date && (
                        <span className="text-gray-500 text-sm">
                          {workout.date.toDate().toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <label>
            <input
              type="checkbox"
              checked={makeActive}
              onChange={(e) => setMakeActive(e.target.checked)}
            />
            Make this plan active for the team
          </label>

          <Button onClick={handleCreatePlan} disabled={loading}>
            {loading ? "Creating..." : "Create Plan"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
