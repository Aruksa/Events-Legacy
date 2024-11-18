import apiClient from "./api-client";

export const fetchGenres = async (token: string) => {
  try {
    const response = await apiClient.get(`/genres`, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response.data.data.map((res: { id: number; name: string }) => ({
      label: res.name,
      value: res.id,
    }));
  } catch (error) {
    console.error("Error fetching genres:", error);
    throw error;
  }
};
