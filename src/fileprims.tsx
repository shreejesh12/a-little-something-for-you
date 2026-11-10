import React from 'react';

export function FileCard({ children }: { children: React.ReactNode }) {
  return <div className="file-card">{children}</div>;
}

export function Header({ title, intro }: { title: string; intro?: string }) {
  return (
    <header className="file-header">
      <h1>{title}</h1>
      {intro ? <p>{intro}</p> : null}
    </header>
  );
}

export function Closing({ children }: { children: React.ReactNode }) {
  return <footer className="file-closing">{children}</footer>;
}
