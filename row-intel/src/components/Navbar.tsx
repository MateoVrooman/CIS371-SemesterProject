"use client";

import Link from "next/link";
import { useAuthContext } from "@/app/context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const user = useAuthContext();
  const router = useRouter();
  const auth = getAuth();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login"); // Redirect after logout
  };

  return (
    <nav className="bg-primary-darkBlue text-white py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link href="/">
          <h1 className="text-2xl font-bold cursor-pointer">RowIntel</h1>
        </Link>
        <div className="flex gap-12">
          <Link href="/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link href="/training-plans" className="hover:underline">
            Training Plans
          </Link>
          <Link href="/workouts" className="hover:underline">
            Workouts
          </Link>
        </div>
        <div className="flex gap-4">
          {user ? (
            <>
              <button
                onClick={handleLogout}
                className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-black"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="hover:underline">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
