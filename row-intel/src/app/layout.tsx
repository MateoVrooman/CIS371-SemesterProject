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
      <body>
        <AuthContextProvider>
          <Navbar />
          <div className="container mx-auto p-4">{children}</div>
        </AuthContextProvider>
      </body>
    </html>
  );
}
