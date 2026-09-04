
import React from "react";

interface ChatPaneProps {
  onOpenArtifact: (artifact: { title: string; content: string; type: "markdown" | "html" }) => void;
}

export default function ChatPane({ onOpenArtifact }: ChatPaneProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "1.5rem" }}>
      <h2>Lenny Growth Assistant Chat</h2>
      <p>Ask growth and product questions grounded in Lenny transcripts.</p>
    </div>
  );
}

