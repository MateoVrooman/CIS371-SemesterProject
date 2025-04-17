import { Timestamp } from "firebase/firestore";
import { Workout } from "@/lib/types";

interface WorkoutDataDisplayProps {
  workoutData: Workout;
  isCoach?: boolean;
}

// Helper function to conditionally format and display a stat
const formatStat = (label: string, value?: string | number) => {
  if (value === undefined || value === null || value === "" || value === 0)
    return null;
  return (
    <div className="flex flex-col items-center p-1 text-xs" key={label}>
      <span className="font-semibold">{label}</span>
      <span>{value}</span>
    </div>
  );
};

const WorkoutDataDisplay = ({
  workoutData,
  isCoach,
}: WorkoutDataDisplayProps) => {
  const { workoutType, rpe, userName, timestamp } = workoutData;

  const statBlocks = [];

  if (workoutType === "row" || workoutType === "erg") {
    statBlocks.push(
      formatStat("Distance", workoutData.distance),
      formatStat("Time", workoutData.time),
      formatStat("Pace", workoutData.pace),
      formatStat("RPE", rpe)
    );
  } else if (workoutType === "cross training") {
    statBlocks.push(
      formatStat("Type", workoutData.crossType),
      formatStat("Distance", workoutData.distance),
      formatStat("Time", workoutData.time),
      formatStat("RPE", rpe)
    );
  } else if (workoutType === "weights") {
    statBlocks.push(
      formatStat("Sets & Reps", workoutData.setsReps),
      formatStat("RPE", rpe)
    );
  }

  return (
    <div className="w-full h-fit text-center p-3 rounded border border-primary-grey hover:border-primary-lightBlue shadow-sm">
      <div className="text-black">
        <div className="flex flex-row text-center items-center gap-2 w-full justify-center mb-1">
          {isCoach && <p className="text-sm font-medium">{userName}:</p>}
          <h2 className="font-semibold text-base">
            {workoutType.toUpperCase()}
          </h2>
        </div>
        <p className="text-xs text-gray-500 mb-2">
          {(timestamp as Timestamp).toDate().toLocaleString()}
        </p>

        <div className="flex flex-wrap justify-center gap-3 text-sm">
          {statBlocks.filter(Boolean)}
        </div>
      </div>
    </div>
  );
};

export default WorkoutDataDisplay;
