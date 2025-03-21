// Mateo Vrooman - RowIntel - CIS371

// pages/login.tsx

"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loginUser } from "@/lib/auth";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error("Login failed.");
      router.push("/dashboard"); // Redirect to dashboard after login
    } catch (err) {
      setError("Failed to log in. Please check your credentials.");
    }
  };

  return (
    <div className="w-full h-full">
      <Card className="w-xl h-fit p-12 flex flex-col mx-auto mt-12">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to log in</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col space-y-8">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" className="bg-primary-darkBlue">
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <p className="text-center font-light, text-sm">
            Don't have an account?
          </p>
          <a
            href="/registration"
            className="text-blue-500 hover:underline text-sm"
          >
            Register Here
          </a>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
