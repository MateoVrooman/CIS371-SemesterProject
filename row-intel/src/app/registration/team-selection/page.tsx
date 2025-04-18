"use client";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TeamSelection() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="p-6 w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Join or Create a Team</h2>
        <p className="mb-6 text-gray-600">
          You can join an existing team or create your own. You can also skip
          and do this later.
        </p>
        <div className="space-y-4">
          <Button
            className="w-full bg-primary-darkBlue"
            onClick={() => router.push("team-selection/join")}
          >
            Join a Team
          </Button>
          <Button
            className="w-full bg-primary-darkBlue"
            onClick={() => router.push("team-selection/create")}
          >
            Create a Team
          </Button>
          <Button
            className="w-full bg-primary-grey text-black"
            onClick={() => router.push("/dashboard")}
          >
            Skip for Now
          </Button>
        </div>
      </Card>
    </div>
  );
}
