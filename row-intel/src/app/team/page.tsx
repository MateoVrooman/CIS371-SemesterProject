"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getTeamName,
  getTeamMemberNames,
  getJoinCodeStatus,
  generateNewJoinCode,
} from "@/lib/teamHelpers"; // adjust path to where you put the helpers

const teamId = "cpoJ1WukyQPbAgLhjtGS"; // Replace with actual or dynamic ID

export default function Team() {
  const [teamName, setTeamName] = useState<string | null>(null);
  const [memberNames, setMemberNames] = useState<string[]>([]);
  const [joinCode, setJoinCode] = useState<string>("");
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeamData = async () => {
      setLoading(true);
      const [name, members, codeInfo] = await Promise.all([
        getTeamName(teamId),
        getTeamMemberNames(teamId),
        getJoinCodeStatus(teamId),
      ]);

      setTeamName(name);
      setMemberNames(members);
      if (codeInfo) {
        setJoinCode(codeInfo.joinCode);
        setIsExpired(codeInfo.expired);
      }
      setLoading(false);
    };

    loadTeamData();
  }, []);

  const handleGenerateNewCode = async () => {
    const newCode = await generateNewJoinCode(teamId);
    setJoinCode(newCode);
    setIsExpired(false);
  };

  return (
    <div className="w-full px-4">
      <Card className="max-w-2xl mx-auto mt-6">
        <CardTitle className="text-center pt-6 text-xl font-bold">
          {teamName ? teamName : "Loading Team..."}
        </CardTitle>

        <CardContent className="py-4">
          {loading ? (
            <p className="text-center text-muted">Loading team members...</p>
          ) : (
            <>
              <h3 className="font-semibold text-center text-lg mb-2">
                Team Members
              </h3>
              <ul className="list-disc list-inside text-sm text-left mb-4">
                {memberNames.map((name, idx) => (
                  <li key={idx}>{name}</li>
                ))}
              </ul>

              <div className="mt-4 text-center">
                <h4 className="font-semibold text-base">Join Code:</h4>
                <p
                  className={`text-lg font-mono ${
                    isExpired ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {joinCode}
                </p>
                {isExpired && (
                  <p className="text-sm text-red-500 mb-2">
                    This join code has expired.
                  </p>
                )}
                <Button onClick={handleGenerateNewCode} variant="outline">
                  Generate New Code
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
