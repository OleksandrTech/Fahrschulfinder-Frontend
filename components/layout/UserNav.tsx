// src/components/layout/UserNav.tsx
import Link from "next/link";
import { User } from "lucide-react";
import { logout } from "@/app/auth/actions/authActions";

export default function UserNav() {
    return (
        <div className="flex items-center gap-4">
            <Link
                href="/profile"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                aria-label="View Profile"
            >
                <User className="h-5 w-5" />
            </Link>
            <form action={logout}>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    Logout
                </button>
            </form>
        </div>
    );
}