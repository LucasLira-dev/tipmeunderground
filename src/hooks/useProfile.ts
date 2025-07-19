import { useState, useEffect, useCallback } from "react";
import { profileService, UserProfileResponse } from "@/services/profileServices";

interface UseUserProfileReturn {
  userData: UserProfileResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useUserProfile(userId: string): UseUserProfileReturn {
  const [userData, setUserData] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await profileService.getUserProfile({userId});
      setUserData(data);
      
    } catch (err) {
      console.error("❌ Erro ao buscar perfil:", err);
      setError(err instanceof Error ? err.message : "Erro ao carregar perfil");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const refetch = useCallback(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return {
    userData,
    loading,
    error,
    refetch,
  };
}