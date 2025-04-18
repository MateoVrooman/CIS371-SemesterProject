"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { joinTeam } from "@/lib/teamHelpers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";

const JoinTeam = () => {
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleJoinTeam = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        throw new Error("User not authenticated");
      }
      await joinTeam(userId, joinCode);
      router.push("/dashboard");
    } catch (err) {
      setError("Invalid team code. Please try again.");
      console.log("Error joining team: ", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-2xl font-bold">Join a Team</h1>
      <Input
        type="text"
        placeholder="Enter join code"
        className="max-w-lg"
        value={joinCode}
        onChange={(e) => setJoinCode(e.target.value)}
      />
      {error && <p className="text-red-500">{error}</p>}
      <Button onClick={handleJoinTeam}>Join Team</Button>
    </div>
  );
};

export default JoinTeam;
