"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { joinTeam } from "@/lib/teamHelpers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const JoinTeam = () => {
  const [teamId, setTeamId] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleJoinTeam = async () => {
    try {
      await joinTeam(teamId);
      router.push("/dashboard");
    } catch (err) {
      setError("Invalid team code. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-2xl font-bold">Join a Team</h1>
      <Input
        type="text"
        placeholder="Enter Team Code"
        value={teamId}
        onChange={(e) => setTeamId(e.target.value)}
      />
      {error && <p className="text-red-500">{error}</p>}
      <Button onClick={handleJoinTeam}>Join Team</Button>
    </div>
  );
};

export default JoinTeam;
