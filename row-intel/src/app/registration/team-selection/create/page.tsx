"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";

const CreateTeam = () => {
  const [teamName, setTeamName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleCreateTeam = async () => {
    try {
      const userId = auth.currentUser?.uid;

      if (!userId) {
        throw new Error("User not authenticated");
      }

      const response = await fetch("/api/teams/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamName, userId }),
      });

      console.log("Response: ", response);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create team");
        return;
      }

      await response.json();
      router.push("/dashboard");
    } catch (err) {
      console.log(err);
      setError("Failed to create team. Please try again");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-2xl font-bold">Create a Team</h1>
      <Input
        type="text"
        placeholder="Team Name"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
      />
      {error && <p className="text-red-500">{error}</p>}
      <Button onClick={handleCreateTeam}>Create Team</Button>
    </div>
  );
};

export default CreateTeam;
