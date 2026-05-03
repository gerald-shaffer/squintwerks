/**
 * RockCam Camera View — The AR Experience
 * Design: X-WEB Network Terminal — Broadcast monitor framing
 * 
 * This page creates an A-Frame scene with the 8th Wall engine for real
 * image target detection. When Rock #5 is detected, the video plays
 * overlaid on the physical rock.
 * 
 * The 8th Wall engine + xrextras are loaded via CDN script tags.
 * Image target data is loaded from the preloaded JSON.
 */
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";

export default function CameraView() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<"loading" | "ready" | "detected" | "playing" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically inject the A-Frame scene with 8th Wall
    const setupAR = async () => {
      try {
        // Load image target data
        const targetResponse = await fetch("/manus-storage/rock5_20f40374.json");
        const targetData = await targetResponse.json();
        // Fix the imagePath to use the uploaded luminance image
        targetData.imagePath = "/manus-storage/rock5_luminance_b1dd403e.png";

        // Store target data globally for the xrloaded callback
        (window as any).__rockTargetData = targetData;

        // Check if scripts are already loaded
        if (!(window as any).AFRAME) {
          await loadScript("https://cdn.jsdelivr.net/npm/aframe@1.5.0/dist/aframe-master.min.js");
        }
        
        if (!(window as any).XR8) {
          await loadScript("https://cdn.jsdelivr.net/npm/@8thwall/engine-binary@1/dist/xr.js", {
            async: true,
            crossOrigin: "anonymous",
            "data-preload-chunks": "slam",
          });
        }

        if (!(window as any).XRExtras) {
          await loadScript("https://cdn.jsdelivr.net/npm/@8thwall/xrextras@1/dist/xrextras.js", {
            crossOrigin: "anonymous",
          });
        }

        // Wait for XR8 to be ready
        const waitForXR8 = () => new Promise<void>((resolve) => {
          if ((window as any).XR8) {
            resolve();
          } else {
            window.addEventListener("xrloaded", () => resolve(), { once: true });
          }
        });

        await waitForXR8();

        // Configure image targets
        const XR8 = (window as any).XR8;
        XR8.XrController.configure({
          imageTargetData: [targetData],
        });

        setStatus("ready");

        // Now create the A-Frame scene
        if (containerRef.current) {
          createARScene(containerRef.current);
        }
      } catch (err: any) {
        console.error("AR setup error:", err);
        setErrorMsg(err.message || "Failed to initialize AR");
        setStatus("error");
      }
    };

    setupAR();

    return () => {
      // Cleanup: remove the a-scene if it exists
      const scene = document.querySelector("a-scene");
      if (scene) {
        scene.remove();
      }
    };
  }, []);

  const handleBack = () => {
    // Clean up the scene before navigating
    const scene = document.querySelector("a-scene");
    if (scene) {
      scene.remove();
    }
    setLocation("/");
  };

  if (status === "error") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black px-6">
        <div className="text-center">
          <div className="w-12 h-12 border border-gold/40 flex items-center justify-center mx-auto mb-4">
            <span className="text-gold text-xl">⚠</span>
          </div>
          <h2 className="font-display text-lg text-foreground tracking-wider uppercase mb-2">
            AR Engine Error
          </h2>
          <p className="font-body text-sm text-muted-foreground mb-6">
            {errorMsg || "Unable to start the AR experience. Please ensure you're using a supported mobile browser with camera access."}
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-2 border border-gold/40 text-gold font-display text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-black transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative bg-black overflow-hidden">
      {/* A-Frame scene container */}
      <div ref={containerRef} className="absolute inset-0 z-0" id="ar-container" />

      {/* UI Overlay - always on top of the AR scene */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {/* Top bar - Network branding */}
        <header className="px-4 pt-3 pb-2 bg-gradient-to-b from-black/70 to-transparent pointer-events-auto">
          <div className="flex items-center justify-between">
            <button onClick={handleBack} className="flex items-center gap-1">
              <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-display text-[10px] text-gold tracking-wider uppercase">Exit</span>
            </button>
            
            <div className="flex items-center gap-2">
              <span className="font-display text-gold text-[10px] font-semibold tracking-[0.15em] uppercase">
                X-WEB
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {status === "loading" && (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-signal-pulse" />
                  <span className="font-display text-[9px] text-yellow-400/70 tracking-wider uppercase">
                    Loading
                  </span>
                </>
              )}
              {status === "ready" && (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-gold animate-signal-pulse" />
                  <span className="font-display text-[9px] text-gold/70 tracking-wider uppercase">
                    Scanning
                  </span>
                </>
              )}
              {(status === "detected" || status === "playing") && (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-signal-pulse" />
                  <span className="font-display text-[9px] text-red-400 tracking-wider uppercase">
                    Live
                  </span>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Viewfinder corners */}
        {status === "ready" && (
          <>
            <div className="absolute top-16 left-4 w-8 h-8 border-t border-l border-gold/40" />
            <div className="absolute top-16 right-4 w-8 h-8 border-t border-r border-gold/40" />
            <div className="absolute bottom-24 left-4 w-8 h-8 border-b border-l border-gold/40" />
            <div className="absolute bottom-24 right-4 w-8 h-8 border-b border-r border-gold/40" />
          </>
        )}

        {/* Bottom bar - Channel identity */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-8 bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex items-end justify-between mb-2">
            <div>
              <p className="font-display text-[10px] text-gold/60 tracking-[0.2em] uppercase mb-0.5">
                Channel
              </p>
              <p className="font-display text-xs text-foreground tracking-wider uppercase">
                Robert Creek Rock Museum
              </p>
            </div>
            <div>
              <p className="font-display text-[9px] text-muted-foreground/60 tracking-wider">
                Rock #5
              </p>
            </div>
          </div>

          {/* Scanning hint */}
          {status === "ready" && (
            <div className="text-center mt-2">
              <p className="font-body text-[11px] text-muted-foreground/60">
                Point camera at Rock #5 to begin
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Loading overlay */}
      {status === "loading" && (
        <div className="absolute inset-0 z-30 bg-black flex flex-col items-center justify-center">
          <div className="w-8 h-8 border border-gold/40 flex items-center justify-center mb-4 animate-signal-pulse">
            <div className="w-3 h-3 bg-gold/60" />
          </div>
          <p className="font-display text-xs text-gold tracking-[0.2em] uppercase">
            Initializing AR Engine
          </p>
          <p className="font-body text-[10px] text-muted-foreground mt-2">
            Loading image targets...
          </p>
        </div>
      )}
    </div>
  );
}

// Helper: load a script dynamically
function loadScript(src: string, attrs?: Record<string, any>): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    if (attrs) {
      Object.entries(attrs).forEach(([key, value]) => {
        if (key === "crossOrigin") {
          script.crossOrigin = value;
        } else {
          script.setAttribute(key, String(value));
        }
      });
    }
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load: ${src}`));
    document.head.appendChild(script);
  });
}

// Create the A-Frame AR scene with image target tracking
function createARScene(container: HTMLElement) {
  // Create the scene HTML
  const sceneHTML = `
    <a-scene
      xrextras-gesture-detector
      xrextras-loading
      xrextras-runtime-error
      renderer="colorManagement:true"
      xrweb="disableWorldTracking: true"
      embedded
      style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    >
      <a-assets>
        <video
          id="rock5-video"
          src="/manus-storage/rock5-video_91ce8cdc.mp4"
          preload="auto"
          loop="true"
          crossorigin="anonymous"
          playsinline
          webkit-playsinline
        ></video>
      </a-assets>

      <a-camera position="0 4 10" raycaster="objects: .cantap" cursor="fuse: false; rayOrigin: mouse;"></a-camera>
      <a-light type="directional" intensity="0.5" position="1 1 1"></a-light>
      <a-light type="ambient" intensity="1"></a-light>

      <xrextras-named-image-target name="rock5">
        <a-entity
          xrextras-play-video="video: #rock5-video; thumb: #rock5-video; canstop: true"
          geometry="primitive: plane; height: 1; width: 0.75;"
        ></a-entity>
      </xrextras-named-image-target>
    </a-scene>
  `;

  container.innerHTML = sceneHTML;
}
