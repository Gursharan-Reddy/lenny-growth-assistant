export interface ChatResponse {
  response: string;
  session_id: string;
  sources: Array<{ title: string; author: string }>;
  artifact?: {
    title: string;
    content: string;
    type: "markdown" | "html";
  };
}

const API_BASE = "http://localhost:8000/api";

export async function sendChatMessage(
  sessionId: string,
  message: string
): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, message }),
  });

  if (!res.ok) throw new Error("Failed to communicate with backend");
  return res.json();
}