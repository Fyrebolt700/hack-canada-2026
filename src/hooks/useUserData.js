import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth0 } from "@auth0/auth0-react";

export function useUserData() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      const docRef = doc(db, "users", user.sub);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
      setLoading(false);
    };
    fetchData();
  }, [isAuthenticated, isLoading, user]);

  const saveCompletedTasks = async (completedTaskIds) => {
    if (!user) return;
    const docRef = doc(db, "users", user.sub);
    await updateDoc(docRef, { completedTasks: completedTaskIds });
  };

  return { userData, loading, saveCompletedTasks };
}