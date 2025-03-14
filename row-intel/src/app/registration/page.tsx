// Mateo Vrooman - RowIntel - CIS371

// pages/register.tsx

"use client";
import { useState, FormEvent } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase";
import { db } from "../../lib/firebase";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<"coach" | "athlete">("athlete"); // Default role
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // Authenticate user by creating account with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Create user document in users collection
      await setDoc(doc(db, "users", userCredential.user.uid), {
        userId: userCredential.user.uid,
        email: email,
        role: role,
        firstName: firstName,
        lastName: lastName,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to register. Please try again.");
    }
  };

  return (
    <div>
      <Card className="w-xl h-fit p-12 flex flex-col mx-auto mt-12">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create an account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col space-y-8 ">
            <div className="flex flex-row w-full space-x-4">
              <Input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
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
            <Select
              onValueChange={(value) => setRole(value as "coach" | "athlete")}
              defaultValue="athlete"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Are you a coach or athlete" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="coach">Coach</SelectItem>
                  <SelectItem value="athlete">Athlete</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button type="submit" className="bg-primary-darkBlue">
              Create Account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <p className="text-center font-light, text-sm">
            Already have an account?
          </p>
          <a
            href="/registration"
            className="text-blue-500 hover:underline text-sm"
          >
            Log in
          </a>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
