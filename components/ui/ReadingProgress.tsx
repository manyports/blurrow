"use client";

import React, { useState, useEffect } from "react";

interface ReadingProgressProps {
  className?: string;
}

export function ReadingProgress({ className = "" }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    // One measurement per frame, however fast the scroll events arrive
    const update = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    measure();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden
      className={["fixed top-0 left-0 right-0 z-[80] h-[2px] bg-transparent pointer-events-none", className].join(" ")}
    >
      <div
        className="h-full w-full origin-left"
        style={{
          // transform instead of width: no layout on every scroll frame
          transform: `scaleX(${progress / 100})`,
          background: "linear-gradient(90deg, #0a0a0a 0%, #262626 100%)",
          boxShadow: "0 0 8px rgba(17,17,17,0.3)",
        }}
      />
    </div>
  );
}
