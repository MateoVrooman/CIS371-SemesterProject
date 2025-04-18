"use client";

import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const Page = () => {
  const user = useAuth();
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-black text-center p-4">
      <h1 className="text-4xl font-bold mb-4">RowIntel</h1>
      <p className="text-lg mb-8">This is the main landing page.</p>

      {user ? (
        <div>
          <p className="text-xl">
            You&apos;re logged in as{" "}
            <strong>{user.displayName || user.email}</strong>.
          </p>
        </div>
      ) : (
        <div className="flex gap-4">
          <Button onClick={() => router.push("/login")}>Login</Button>
          <Button onClick={() => router.push("/register")} variant="outline">
            Register
          </Button>
        </div>
      )}
    </div>
  );
};

export default Page;
