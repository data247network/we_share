"use client";

import { useEffect, useState } from "react";
import { WS } from "@/components/brand/tokens";

interface Props {
  expiresAt: string;
  style?: React.CSSProperties;
}

export function CountdownTimer({ expiresAt, style }: Props) {
  const [timeLeft, setTimeLeft] = useState("");
  const [urgent, setUrgent] = useState(false);

  useEffect(() => {
    function update() {
      const ms = new Date(expiresAt).getTime() - Date.now();
      if (ms <= 0) { setTimeLeft("Closed"); return; }
      const h = Math.floor(ms / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      const d = Math.floor(h / 24);
      setUrgent(h < 6);
      setTimeLeft(d > 0 ? `${d}d ${h % 24}h left` : `${h}h ${m}m left`);
    }
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, [expiresAt]);

  return (
    <span style={{ color: urgent ? WS.terra : WS.ink2, fontWeight: 600, fontSize: 11, ...style }}>
      ⏱ {timeLeft}
    </span>
  );
}
