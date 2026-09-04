// frontend/lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface ChatResponse {
  response: string;
  sources?: Array<{ title: string; author: string }>;
  artifact?: {
    title: string;
    content: string;
    type: "markdown" | "html";
  };
}

export async function sendChatMessage(sessionId: string, message: string): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      session_id: sessionId,
      message: message,
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to communicate with backend: ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}

export async function fetchSessions() {
  const res = await fetch(`${API_BASE}/sessions`);
  if (!res.ok) {
    throw new Error("Failed to fetch sessions");
  }
  return res.json();
}