// frontend/components/Artifact/ArtifactViewer.tsx
"use client";

import ReactMarkdown from "react-markdown";

interface ArtifactViewerProps {
  title: string;
  content: string;
  type: "markdown" | "html";
  onClose: () => void;
}

export default function ArtifactViewer({
  title,
  content,
  type,
  onClose,
}: ArtifactViewerProps) {
  return (
    <aside className="artifact-drawer">
      <div className="artifact-header">
        <span>{title}</span>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            fontSize: "1rem",
            cursor: "pointer",
            color: "#64748b",
          }}
        >
          ✕
        </button>
      </div>
      <div className="artifact-content" style={{ lineHeight: "1.6" }}>
        {type === "markdown" ? (
          <ReactMarkdown>{content}</ReactMarkdown>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        )}
      </div>
    </aside>
  );
}