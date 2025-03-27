"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import CalendarCard from "@/components/CalendarCard";
import WorkoutHistoryView from "@/components/WorkoutHistoryView";

const Dashboard = () => {
  const user = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  console.log("User: ", auth.currentUser);

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-row ">
      <div className="w-2/3 h-full bg-primary-grey px-6 py-4 flex flex-col gap-3">
        <CalendarCard />
        <div className="w-full bg-amber-400 h-1/3"></div>
      </div>
      <div className="w-1/3 h-full bg-primary-grey px-6 py-4">
        <WorkoutHistoryView />
      </div>
    </div>
  );
};

export default Dashboard;
