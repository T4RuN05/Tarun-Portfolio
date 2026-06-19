"use client";

import { ReactLenis } from "lenis/react";

export default function SmoothScroll({ children }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08, // The lower the number, the smoother and heavier the inertia
        smoothWheel: true,
        smoothTouch: false, // Usually disabled on mobile so native touch scrolling feels natural
      }}
    >
      {children}
    </ReactLenis>
  );
}
