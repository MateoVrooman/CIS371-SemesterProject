// Mateo Vrooman - RowIntel - CIS371

// src/app/layout.tsx
import { AuthContextProvider } from "./context/AuthContext";
import Navbar from "../components/Navbar";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className="h-screen w-screen overflow-hidden flex flex-col">
        <AuthContextProvider>
          <Navbar />
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
