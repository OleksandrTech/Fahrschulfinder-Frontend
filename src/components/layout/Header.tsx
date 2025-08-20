// src/components/layout/Header.tsx
import Link from "next/link";
import { Calculator } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import UserNav from "./UserNav";

// The Header component is now an async function
export default async function Header() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Left Side: Logo and Title */}
          <div className="flex items-center">
            <Calculator className="h-8 w-8 text-blue-600 mr-2" />
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Fahrschulfinder
            </Link>
          </div>

          {/* Right Side: Conditional Buttons */}
          <div>
            {user ? (
              // If user is logged in, show the UserNav component
              <UserNav />
            ) : (
              // If user is not logged in, show Login and Register buttons
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/registration"
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                >
                  Register Your School
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}