interface GetPixData {
    userId: string;
    value: number;
}

interface GetUserProfileData {
    userId: string;
}

interface UserProfileResponse {
    artistName: string;
    bio: string;
    userAvatar: string | null;
    userLink1: string | null; // Instagram
    userLink2: string | null; // Spotify
    userLink3: string | null; // YouTube

}

class ProfileService {
    private baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

    private async makeRequest(
        endpoint: string,
        method: "GET" | "POST" | "PATCH" | "DELETE",
        token?: string,
        data?: string | unknown
    ) {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

         // ← CORRIGIR: Para GET, não usar body
        const fetchOptions: RequestInit = {
            method,
            headers,
        };

        // ← ADICIONAR BODY APENAS SE NÃO FOR GET
        if (method !== "GET" && data) {
            fetchOptions.body = JSON.stringify(data);
        }

       const response = await fetch(`${this.baseURL}${endpoint}`, fetchOptions);

        return response;
    }

    // ← CORRIGIR: GET PIX com query parameters na URL
    async getPix(data: GetPixData) {
       
         const endpoint = `/pix/get-pix/${data.userId}?value=${data.value}`;
        
        console.log("🔗 Endpoint final:", endpoint);
        
        return this.makeRequest(endpoint, "GET"); // ← GET sem body
    }

    async getUserProfile(data: GetUserProfileData): Promise<UserProfileResponse> {
        const endpoint = `/users/get-user-data/${data.userId}`;
        
        const response = await this.makeRequest(endpoint, "GET");

        if (!response.ok) {
            throw new Error("Erro ao obter perfil do usuário");
        }

        return await response.json()
    }
}

export const profileService = new ProfileService()

// ← Exportar tipos para uso em outros arquivos
export type {
  GetPixData,
  GetUserProfileData,
  UserProfileResponse,
};