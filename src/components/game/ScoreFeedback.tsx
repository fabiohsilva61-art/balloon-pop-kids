"use client";

import { useState, useEffect } from "react";

interface FeedbackItem {
  id: number;
  text: string;
  color: string;
  x: number;
  y: number;
}

let feedbackId = 0;

export function useScoreFeedback() {
  const [items, setItems] = useState<FeedbackItem[]>([]);

  function showFeedback(text: string, color: string, x?: number, y?: number) {
    const id = ++feedbackId;
    setItems((prev) => [
      ...prev,
      {
        id,
        text,
        color,
        x: x ?? 50,
        y: y ?? 40,
      },
    ]);
    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }, 1000);
  }

  return { items, showFeedback };
}

export function ScoreFeedbackOverlay({ items }: { items: FeedbackItem[] }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {items.map((item) => (
        <ScoreFeedbackItem key={item.id} item={item} />
      ))}
    </div>
  );
}

function ScoreFeedbackItem({ item }: { item: FeedbackItem }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <div
      className="absolute font-bold text-3xl transition-all duration-700 ease-out"
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
        color: item.color,
        transform: visible ? "translateY(-60px) scale(1.2)" : "translateY(0) scale(1)",
        opacity: visible ? 0 : 1,
        textShadow: "0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      {item.text}
    </div>
  );
}
