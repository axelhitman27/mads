const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5048";

const handleResponse = async (response) => {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Request failed");
  }

  return response.status === 204 ? null : response.json();
};

export const getHomeData = async () => {
  const response = await fetch(`${API_BASE_URL}/api/home`);
  return handleResponse(response);
};

export const sendContactMessage = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/api/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};
