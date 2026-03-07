import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth0 } from "@auth0/auth0-react";

export function useUserData() {
    const { user, isAuthenticated } = useAuth0();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated || !user) return;
        const fetchData = async () => {
            const docRef = doc(db, "users", user.sub);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUserData(docSnap.data());
            }
            setLoading(false);
        };
        fetchData();
    }, [isAuthenticated, user]);

    return { userData, loading };
}