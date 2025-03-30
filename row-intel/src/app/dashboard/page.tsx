"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import CalendarCard from "@/components/CalendarCard";
import WorkoutHistoryView from "@/components/WorkoutHistoryView";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCoachStatus } from "@/lib/auth";
import AddWorkout from "@/components/AddWorkout";

const Dashboard = () => {
  const user = useAuth();
  const router = useRouter();
  const [isCoach, setIsCoach] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        const role = await getCoachStatus(user.uid);
        setIsCoach(role);
      } else {
        setIsCoach(false);
      }
    };

    fetchRole();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  console.log("Is coach: ", isCoach);

  if (!user) {
    return <div>No user</div>;
  }

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-row ">
      <div className="w-2/3 h-full bg-primary-white px-6 py-4 flex flex-col gap-3">
        <CalendarCard />

        {isCoach ? ( // Render coach dashboard actions
          <div className="w-full h-1/3 flex flex-row justify-between py-2 gap-x-2">
            <Card
              className="w-full h-full text-center bg-primary-grey border-2 border-primary-grey hover:border-primary-lightBlue hover:shadow-md"
              onClick={() => router.push("/training-plans")}
            >
              <CardTitle>Training Plans</CardTitle>
            </Card>
            <Card
              className="w-full h-full text-center bg-primary-grey  border-2 border-primary-grey hover:border-primary-lightBlue hover:shadow-md"
              onClick={() => router.push("/lineups")}
            >
              <CardTitle>Lineups</CardTitle>
            </Card>
            <Card
              className="w-full h-full text-center bg-primary-grey  border-2 border-primary-grey hover:border-primary-lightBlue hover:shadow-md"
              onClick={() => router.push("workout-results")}
            >
              <CardTitle>Workout Results</CardTitle>
            </Card>
          </div>
        ) : (
          // Render athlete dashboard actions
          <div className="w-full h-1/3 flex flex-row justify-between py-2 gap-x-2">
            <Card
              className="w-full h-full text-center bg-primary-grey border-2 border-primary-grey hover:border-primary-lightBlue hover:shadow-md"
              onClick={() => router.push("/training-plans")}
            >
              <CardTitle>View Training Plans</CardTitle>
            </Card>
            <Card
              className="w-full h-full text-center bg-primary-grey  border-2 border-primary-grey hover:border-primary-lightBlue hover:shadow-md"
              onClick={() => router.push("/lineups")}
            >
              <CardTitle>View Lineups</CardTitle>
            </Card>
            <Card className="w-full h-full text-center bg-primary-grey  border-2 border-primary-grey hover:border-primary-lightBlue hover:shadow-md">
              <CardTitle>Log New Workout</CardTitle>
              <AddWorkout user={user} />
            </Card>
          </div>
        )}
      </div>
      <div className="w-1/3 h-full bg-primary-white px-6 py-4 ">
        <WorkoutHistoryView />
      </div>
    </div>
  );
};

export default Dashboard;
