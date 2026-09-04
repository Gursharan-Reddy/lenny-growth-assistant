import React from 'react';

interface SandboxedIframeProps {
  content: string;
}

export default function SandboxedIframe({ content }: SandboxedIframeProps) {
  return (
    <iframe
      srcDoc={content}
      sandbox="allow-scripts"
      style={{ width: '100%', height: '100%', border: 'none' }}
      title="Artifact Sandbox"
    />
  );
}