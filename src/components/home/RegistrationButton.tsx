import Link from "next/link";

export default function RegistrationButton() {
    return (
        <Link
            href="/registration"
            className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
            Register Your School
        </Link>
    );
}