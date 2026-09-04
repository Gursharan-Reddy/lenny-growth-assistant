// frontend/app/page.tsx
"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { sendChatMessage, ChatResponse } from "@/lib/api";
import ArtifactViewer from "@/components/Artifact/ArtifactViewer";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Array<{ title: string; author: string }>;
  artifact?: {
    title: string;
    content: string;
    type: "markdown" | "html";
  };
}

interface Session {
  id: string;
  title: string;
}

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([
    { id: "default-session", title: "Current Growth Session" },
    { id: "session-activation", title: "Activation Metrics & Funnels" },
    { id: "session-retention", title: "Retention Loops Strategy" },
  ]);
  const [activeSessionId, setActiveSessionId] = useState("default-session");
  const [chatHistory, setChatHistory] = useState<Record<string, Message[]>>({
    "default-session": [],
    "session-activation": [
      { role: "assistant", content: "Welcome to **Activation Metrics & Funnels**. Ask questions regarding time-to-value and onboarding drop-offs." }
    ],
    "session-retention": [
      { role: "assistant", content: "Welcome to **Retention Loops Strategy**. Explore viral, content, and paid loop frameworks here." }
    ]
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeArtifact, setActiveArtifact] = useState<{ title: string; content: string; type: "markdown" | "html" } | null>(null);

  const messages = chatHistory[activeSessionId] || [];

  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
  };

  const handleNewSession = () => {
    const newId = `session-${Date.now()}`;
    const newTitle = `Growth Session ${sessions.length + 1}`;
    setSessions([...sessions, { id: newId, title: newTitle }]);
    setChatHistory({ ...chatHistory, [newId]: [] });
    setActiveSessionId(newId);
  };

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation(); // prevent triggering session selection
    
    if (sessions.length <= 1) {
      alert("You must keep at least one chat session.");
      return;
    }

    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(updatedSessions);

    const updatedHistory = { ...chatHistory };
    delete updatedHistory[sessionId];
    setChatHistory(updatedHistory);

    if (activeSessionId === sessionId) {
      setActiveSessionId(updatedSessions[0].id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput("");
    
    const updatedMessages = [...messages, { role: "user" as const, content: userMsg }];
    setChatHistory({ ...chatHistory, [activeSessionId]: updatedMessages });
    setLoading(true);

    try {
      const data: ChatResponse = await sendChatMessage(activeSessionId, userMsg);
      const finalMessages = [
        ...updatedMessages,
        {
          role: "assistant" as const,
          content: data.response,
          sources: data.sources,
          artifact: data.artifact,
        },
      ];
      setChatHistory({ ...chatHistory, [activeSessionId]: finalMessages });
      if (data.artifact) {
        setActiveArtifact(data.artifact);
      }
    } catch (err) {
      setChatHistory({
        ...chatHistory,
        [activeSessionId]: [
          ...updatedMessages,
          { role: "assistant" as const, content: "Error communicating with the growth intelligence backend." },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-layout">
      {/* Professional Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>⚡ Growth Intelligence</span>
          <button 
            onClick={handleNewSession}
            style={{ background: '#334155', color: '#fff', border: 'none', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
          >
            + New
          </button>
        </div>
        <div className="sidebar-sessions">
          {sessions.map((s) => (
            <div
              key={s.id}
              onClick={() => handleSelectSession(s.id)}
              className={`session-item ${activeSessionId === s.id ? "active" : ""}`}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                cursor: 'pointer',
                backgroundColor: activeSessionId === s.id ? '#334155' : 'transparent',
                color: activeSessionId === s.id ? '#ffffff' : '#94a3b8',
                marginBottom: '0.25rem'
              }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px' }}>
                {s.title}
              </span>
              <button
                onClick={(e) => handleDeleteSession(e, s.id)}
                title="Delete chat session"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = '#ef4444')}
                onMouseOut={(e) => (e.currentTarget.style.color = '#94a3b8')}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="chat-container">
        <header className="chat-header">
          <div>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>The Lenny Growth Assistant</h1>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>Enterprise Product & Growth Intelligence</p>
          </div>
          <span style={{ fontSize: '0.75rem', background: '#dbeafe', color: '#1e40af', padding: '0.25rem 0.75rem', borderRadius: '999px', fontWeight: 500 }}>
            Gemini 2.5 Flash
          </span>
        </header>

        <div className="chat-messages">
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '20vh' }}>
              <h3 style={{ color: '#334155', marginBottom: '0.5rem' }}>Welcome to Lenny Growth Assistant</h3>
              <p style={{ fontSize: '0.9rem' }}>Ask queries grounded in podcast episodes, activation frameworks, and retention playbooks.</p>
            </div>
          )}
          {messages.map((m, idx) => (
            <div key={idx} className={`message-wrapper ${m.role}`}>
              <div className={`message-bubble ${m.role}`}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.35rem', opacity: 0.7 }}>
                  {m.role === "user" ? "You" : "Lenny Growth Assistant"}
                </div>
                <div className="markdown-content" style={{ lineHeight: '1.6' }}>
                  {m.role === "assistant" ? (
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  ) : (
                    <div style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>
                  )}
                </div>
                {m.sources && m.sources.length > 0 && (
                  <div className="sources-box">
                    <span>Grounded Sources:</span>
                    {m.sources.map((src, i) => (
                      <span key={i} className="source-badge">🎙️ {src.title}</span>
                    ))}
                  </div>
                )}
                {m.artifact && (
                  <button
                    onClick={() => setActiveArtifact(m.artifact || null)}
                    style={{ marginTop: '0.75rem', background: '#2563eb', color: '#fff', border: 'none', padding: '0.4rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 }}
                  >
                    📂 View Artifact: {m.artifact.title}
                  </button>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="message-wrapper assistant">
              <div className="message-bubble assistant" style={{ color: '#64748b', fontStyle: 'italic' }}>
                Synthesizing podcast insights and growth frameworks...
              </div>
            </div>
          )}
        </div>

        <div className="chat-input-area">
          <form onSubmit={handleSubmit} className="chat-input-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about retention loops, activation metrics, or pricing strategies..."
              className="chat-input"
            />
            <button type="submit" disabled={loading} className="send-button">
              Send
            </button>
          </form>
        </div>
      </div>

      {/* Artifact Drawer */}
      {activeArtifact && (
        <ArtifactViewer
          title={activeArtifact.title}
          content={activeArtifact.content}
          type={activeArtifact.type}
          onClose={() => setActiveArtifact(null)}
        />
      )}
    </main>
  );
}