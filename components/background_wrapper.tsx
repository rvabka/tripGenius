'use client';

import type React from 'react';

interface BackgroundWrapperProps {
  children: React.ReactNode;
}

export default function BackgroundWrapper({
  children
}: BackgroundWrapperProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Główny gradient tła - delikatne zielone kolory z ciemniejszymi akcentami */}
      <div
        className="fixed inset-0 bg-gradient-to-br from-[#f0f5f1] via-[#e6f0e8] to-[#eaf5ec] z-0"
        aria-hidden="true"
      />

      {/* Ciemniejsze akcenty */}
      <div
        className="fixed top-0 right-0 w-[40%] h-[40%] bg-gradient-to-bl from-[#2d3b2d]/10 to-transparent rounded-bl-[100%] z-0"
        aria-hidden="true"
      />
      <div
        className="fixed bottom-0 left-0 w-[35%] h-[30%] bg-gradient-to-tr from-[#1a2e1a]/15 to-transparent rounded-tr-[100%] z-0"
        aria-hidden="true"
      />

      {/* Dodatkowe ciemne akcenty */}
      <div
        className="fixed top-[30%] right-[5%] w-[10rem] h-[10rem] bg-[#1a2e1a]/10 rounded-full blur-[5rem] z-0"
        aria-hidden="true"
      />
      <div
        className="fixed bottom-[20%] left-[15%] w-[8rem] h-[8rem] bg-[#1a2e1a]/8 rounded-full blur-[4rem] z-0"
        aria-hidden="true"
      />

      {/* Kontener treści */}
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
}
