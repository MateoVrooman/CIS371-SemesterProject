"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import CalendarCard from "@/components/CalendarCard";
import WorkoutHistoryView from "@/components/WorkoutHistoryView";
import { Card, CardTitle } from "@/components/ui/card";
import { getCoachStatus } from "@/lib/auth";
import { PlannedWorkout } from "@/lib/types";
import {
  getActivePlan,
  getTeam,
  getTrainingPlanWorkouts,
} from "@/lib/dbHelpers";

const Dashboard = () => {
  const user = useAuth();
  const router = useRouter();
  const [isCoach, setIsCoach] = useState<boolean>(false);
  const [activePlanWorkouts, setActivePlanWorkouts] = useState<
    PlannedWorkout[]
  >([]);
  const [activePlanId, setActivePlanId] = useState<string>("");
  const [activePlanName, setActivePlanName] = useState<string>("");

  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        const role = await getCoachStatus(user.uid);
        setIsCoach(role);
      } else {
        setIsCoach(false);
      }
    };
    const fetchActivePlan = async () => {
      if (user) {
        const teamId = await getTeam(user.uid);
        const activePlan = await getActivePlan(teamId);
        if (!activePlan) {
          console.log("No active plan");
          return;
        }
        const workouts = await getTrainingPlanWorkouts(activePlan.id);
        if (!workouts) {
          console.log("No workouts found");
          return;
        }
        setActivePlanWorkouts(workouts);
        setActivePlanId(activePlan.id);
        setActivePlanName(activePlan.name);
        console.log("Active plan workouts: ", workouts);
      }
    };

    fetchRole();
    fetchActivePlan();
  }, [user]);

  console.log("Is coach: ", isCoach);

  if (!user) {
    return <div>No user</div>;
  }

  return (
    <div className="w-screen h-screen md:overflow-hidden flex md:flex-row flex-col">
      <div className="md:w-2/3 w-full h-full bg-primary-white px-6 py-4 flex flex-col gap-3">
        <h2 className="text-2xl font-bold">
          Current Training Plan: {activePlanName}
        </h2>
        <CalendarCard
          workouts={activePlanWorkouts}
          activePlanId={activePlanId}
          isCoach={isCoach}
        />
      </div>
      <div className="md:w-1/3 w-full h-full bg-primary-white px-6 py-4 flex flex-col gap-y-4">
        <WorkoutHistoryView isCoach={isCoach} />
        {isCoach ? ( // Render coach dashboard actions
          <div className="w-full h-1/4 flex flex-row justify-between gap-x-2">
            <Card
              className="w-full h-full text-center bg-primary-darkBlue border-2 border-primary-darkBlue hover:border-primary-lightBlue hover:shadow-md text-white"
              onClick={() => router.push("/training-plans/create")}
            >
              <CardTitle>Create Training Plan</CardTitle>
            </Card>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Dashboard;
