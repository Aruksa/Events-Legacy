import apiClient from "./api-client";

export const createEvent = async (eventData: any, token: string) => {
  try {
    const response = await apiClient.post(`/events`, eventData, {
      headers: { authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};
