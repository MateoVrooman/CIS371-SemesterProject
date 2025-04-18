import { useAuth } from "@/components/context/AuthContext";
import { Card } from "@/components/ui/card";
import { getUserWorkouts, getTeamWorkouts, getTeam } from "@/lib/dbHelpers";
import { useEffect, useState } from "react";
import WorkoutDataDisplay from "./workoutDataDisplay";
import { Workout } from "@/lib/types";

const WorkoutHistoryView = ({ isCoach }: { isCoach: boolean }) => {
  const user = useAuth();

  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!user) return;
      if (isCoach) {
        const teamId = await getTeam(user.uid);
        const teamWorkouts = await getTeamWorkouts(teamId);
        setWorkouts(teamWorkouts as Workout[]);
        console.log("Team workouts: ", teamWorkouts);
      } else {
        const userWorkouts = await getUserWorkouts(user.uid);
        setWorkouts(userWorkouts as Workout[]);
      }
    };
    fetchWorkouts();
  }, [isCoach, user]);

  if (!user) {
    return <div>No user</div>;
  }

  return (
    <Card className="w-full bg-primary-grey h-full min-h-96 text-center flex flex-col gap-0 overflow-y-scroll">
      <h2 className="text-left font-semibold text-xl ml-4">Workout History</h2>
      {workouts.map((workout) => (
        <WorkoutDataDisplay
          key={workout.id}
          workoutData={workout}
          isCoach={isCoach}
        />
      ))}
    </Card>
  );
};

export default WorkoutHistoryView;
