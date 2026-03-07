import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function Navbar() {
    const { logout, user } = useAuth0();
    return (
        <nav className="bg-red-700 text-white px-6 py-4 flex justify-between items-center">
            <Link to="/dashboard" className="font-bold text-xl">🍁 NewStart Canada</Link>
            <div className="flex gap-6 items-center">
                <Link to="/checklist" className="hover:underline">Checklist</Link>
                <Link to="/chatbot" className="hover:underline">Chatbot</Link>
                <Link to="/map" className="hover:underline">Map</Link>
                <span className="text-sm opacity-75">{user?.name}</span>
                <button
                    onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                    className="bg-white text-red-700 px-3 py-1 rounded font-medium hover:bg-red-50"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}