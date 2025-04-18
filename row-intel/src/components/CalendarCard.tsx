"use client";

import {
  Calendar,
  CalendarCurrentDate,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarMonthView,
  CalendarEvent,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  CalendarWeekView,
} from "./ui/full-calendar";

import { Card, CardContent } from "@/components/ui/card";
import { PlannedWorkout } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AddWorkout from "./AddWorkout";
import { useAuth } from "@/components/context/AuthContext";

interface TrainingPlanCalendarProps {
  workouts: PlannedWorkout[];
  activePlanId: string;
  isCoach: boolean;
}

const getColor = (workoutType: string) => {
  switch (workoutType) {
    case "row":
      return "blue";
    case "erg":
      return "green";
    case "cross training":
      return "purple";
    case "weights":
      return "red";
    default:
      return "pink";
  }
};

const CalendarCard = ({
  workouts,
  activePlanId,
  isCoach,
}: TrainingPlanCalendarProps) => {
  const events: CalendarEvent[] = workouts.map((workout) => ({
    id: workout.id,
    title: workout.workoutType,
    start: new Date(workout.date.seconds * 1000),
    end: new Date(workout.date.seconds * 1000 + 60 * 60 * 1000), // Assuming 1 hour duration
    color: getColor(workout.workoutType),
    allDay: true,
  }));
  const user = useAuth();
  if (!user) {
    return <div>No user</div>;
  }

  console.log("Calendar events: ", events);

  return (
    <Card className="h-full w-full bg-primary-grey mx-auto">
      <CardContent className="h-full w-full flex flex-col">
        <Calendar
          events={events}
          workouts={workouts}
          activePlanId={activePlanId}
        >
          <div className="h-full py-2 flex flex-col">
            <div className="flex px-6 items-center gap-2 mb-6">
              <CalendarViewTrigger
                view="week"
                className="aria-[current=true]:bg-accent"
              >
                Week
              </CalendarViewTrigger>
              <CalendarViewTrigger
                view="month"
                className="aria-[current=true]:bg-accent"
              >
                Month
              </CalendarViewTrigger>

              <span className="flex-1" />

              <CalendarCurrentDate />

              <CalendarPrevTrigger>
                <ChevronLeft size={20} />
                <span className="sr-only">Previous</span>
              </CalendarPrevTrigger>

              <CalendarTodayTrigger>Today</CalendarTodayTrigger>

              <CalendarNextTrigger>
                <ChevronRight size={20} />
                <span className="sr-only">Next</span>
              </CalendarNextTrigger>
            </div>

            <div className="flex-1 overflow-auto px-2 relative">
              <CalendarWeekView />
              <CalendarMonthView />
            </div>
          </div>
        </Calendar>
        {!isCoach && <AddWorkout user={user} />}
      </CardContent>
    </Card>
  );
};

export default CalendarCard;
