/**
 * RockCam Home / Launch Screen
 * Design: X-WEB Network Terminal — Broadcast media aesthetic
 * Colors: True black + X-WEB gold (#C9A84C / oklch(0.78 0.12 85))
 * Typography: Barlow Condensed (display) + DM Sans (body)
 */
import { useLocation } from "wouter";
import { useState } from "react";

export default function Home() {
  const [, setLocation] = useLocation();
  const [launching, setLaunching] = useState(false);

  const handleLaunch = () => {
    setLaunching(true);
    setTimeout(() => setLocation("/cam"), 600);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between bg-black relative overflow-hidden">
      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="w-full h-[2px] bg-gold animate-scan-line" />
      </div>

      {/* Top network bar */}
      <header className="w-full px-4 pt-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="font-display text-gold text-xs font-semibold tracking-[0.2em] uppercase">
            X-WEB
          </span>
          <span className="text-gold-dim text-[10px] opacity-60">.IO</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-signal-pulse" />
          <span className="font-display text-[10px] text-muted-foreground tracking-wider uppercase">
            Network Online
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 z-10">
        {/* Channel identity */}
        <div className="text-center mb-8">
          <div className="w-16 h-[1px] bg-gold mx-auto mb-6 opacity-40" />
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground tracking-tight leading-none mb-2">
            ROCKCAM
          </h1>
          <p className="font-display text-sm text-gold tracking-[0.3em] uppercase mt-2">
            Robert Creek Rock Museum
          </p>
          <div className="w-16 h-[1px] bg-gold mx-auto mt-6 opacity-40" />
        </div>

        {/* Instructions */}
        <div className="text-center mb-10 max-w-[280px]">
          <p className="font-body text-sm text-muted-foreground leading-relaxed">
            Point your camera at the numbered rocks to unlock their stories.
          </p>
        </div>

        {/* Launch button */}
        <button
          onClick={handleLaunch}
          disabled={launching}
          className={`
            relative px-10 py-4 border border-gold text-gold font-display text-sm font-semibold
            tracking-[0.2em] uppercase transition-all duration-300
            hover:bg-gold hover:text-black
            active:scale-95
            disabled:opacity-50
            ${launching ? 'bg-gold text-black' : ''}
          `}
        >
          {launching ? (
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-black rounded-full animate-signal-pulse" />
              INITIALIZING
            </span>
          ) : (
            "OPEN CAMERA"
          )}
        </button>

        {/* Exhibit count */}
        <div className="mt-8 flex items-center gap-3">
          <span className="font-display text-xs text-muted-foreground tracking-wider">
            5 EXHIBITS LOADED
          </span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className={`w-2 h-2 border ${n === 5 ? 'border-gold bg-gold/30' : 'border-muted-foreground/30'}`}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Bottom bar */}
      <footer className="w-full px-4 pb-4 z-10">
        <div className="flex items-center justify-between">
          <span className="font-display text-[9px] text-muted-foreground/50 tracking-wider uppercase">
            Powered by X-WEB.IO
          </span>
          <span className="font-display text-[9px] text-muted-foreground/50 tracking-wider uppercase">
            Shaffer Media Group
          </span>
        </div>
        <div className="w-full h-[1px] bg-gold/20 mt-2" />
      </footer>
    </div>
  );
}
