import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
const TERMINAL_LINES = [
  { text: "> ACCESSING VAULT...", color: "#CCCCCC", delay: 0 },
  { text: "> SECRET KEY FOUND", color: "#CCFF00", delay: 300 },
  { text: "> ROTATING...", color: "#CCCCCC", delay: 600 },
  { text: "> ✓ COMPLETE", color: "#CCFF00", delay: 900 },
];

function useScramble(finalText: string, active: boolean, onComplete?: () => void) {
  const [text, setText] = useState("");
  const onCompleteRef = useRef<(() => void) | undefined>(undefined);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!active) {
      setText("");
      return;
    }

    const chars = finalText.split("");
    const revealed: (string | null)[] = chars.map(() => null);
    let completed = 0;
    let interval: ReturnType<typeof setInterval> | null = null;

    interval = setInterval(() => {
      if (completed >= chars.length) {
        if (interval) clearInterval(interval);
        setText(finalText);
        onCompleteRef.current?.();
        return;
      }

      const unrevealed = chars.reduce<number[]>((acc, _, i) => {
        if (revealed[i] === null) acc.push(i);
        return acc;
      }, []);

      if (unrevealed.length === 0) {
        if (interval) clearInterval(interval);
        setText(finalText);
        onCompleteRef.current?.();
        return;
      }

      const revealIdx = unrevealed[Math.floor(Math.random() * unrevealed.length)];
      revealed[revealIdx] = chars[revealIdx];
      completed++;

      const display = chars.map((_, i) =>
        revealed[i] !== null ? revealed[i] : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
      );
      setText(display.join(""));
    }, 40);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [active, finalText]);

  return text;
}

function TerminalLine({ line }: { line: (typeof TERMINAL_LINES)[0] }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayed("");
    setDone(false);
    const timer = setTimeout(() => {
      const iv = setInterval(() => {
        if (i < line.text.length) {
          setDisplayed(line.text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(iv);
          setDone(true);
        }
      }, 30);
    }, line.delay);
    return () => clearTimeout(timer);
  }, [line.text, line.delay]);

  return (
    <motion.p
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, delay: line.delay / 1000 }}
      className="text-[11px] font-mono leading-[1.6]"
      style={{ color: line.color }}
    >
      {displayed}
      {!done && <span className="animate-pulse text-white">_</span>}
    </motion.p>
  );
}

function EyeOpenIcon() {
  return (
    <svg
      className="w-8 h-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1a1a1a"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" fill="#1a1a1a" stroke="none" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      className="w-7 h-7"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1a1a1a"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const posLabelRef = useRef<HTMLSpanElement>(null);

  const [boxState, setBoxState] = useState<"eye-open" | "secured">("eye-open");
  const [showTooltip, setShowTooltip] = useState(false);
  const [showScanline, setShowScanline] = useState(false);
  const [glitchOpacity, setGlitchOpacity] = useState(0);
  const [scrambleActive, setScrambleActive] = useState(false);

  const getRandomPos = useCallback(() => {
    if (!canvasRef.current) return { x: 60, y: 50 };
    const w = canvasRef.current.clientWidth;
    const h = canvasRef.current.clientHeight;
    const excludeRight = 340;
    const excludeTop = 260;

    let x: number;
    let y: number;
    let attempts = 0;
    do {
      x = 20 + Math.random() * Math.max(w - 160, 100);
      y = 30 + Math.random() * Math.max(h - 200, 100);
      attempts++;
    } while (x > w - excludeRight && y < excludeTop && attempts < 30);

    return { x, y };
  }, []);

  const updateCoordLabels = useCallback((x: number, y: number) => {
    if (posLabelRef.current) {
      gsap.to(posLabelRef.current, {
        opacity: 0,
        duration: 0.05,
        onComplete: () => {
          if (posLabelRef.current) {
            posLabelRef.current.textContent = `POS ${Math.round(x)}, ${Math.round(y)}`;
            gsap.to(posLabelRef.current, { opacity: 1, duration: 0.15 });
          }
        },
      });
    }
  }, []);

  const triggerGlitch = useCallback(() => {
    const steps = [
      { opacity: 0.15, at: 0 },
      { opacity: 0, at: 60 },
      { opacity: 0.1, at: 140 },
      { opacity: 0, at: 180 },
      { opacity: 0.08, at: 240 },
      { opacity: 0, at: 280 },
    ];
    steps.forEach(({ opacity, at }) => {
      setTimeout(() => setGlitchOpacity(opacity), at);
    });
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !boxRef.current) return;

    const box = boxRef.current;

    const moveBox = (target: { x: number; y: number }) => {
      const tl = gsap.timeline();
      tl.to(box, {
        x: target.x,
        y: target.y,
        duration: 1.2,
        ease: "power3.inOut",
        onStart: () => updateCoordLabels(target.x, target.y),
        onComplete: () => {
          // box reached target
        },
      });
      return tl;
    };

    const pause = (duration: number) => {
      const tl = gsap.timeline();
      tl.to({}, { duration });
      return tl;
    };

    const runCycle = () => {
      const target = getRandomPos();

      const tl = gsap.timeline({
        onComplete: () => {
          timelineRef.current = runCycle();
        },
      });

      tl.add(moveBox(target))
        .add(() => {
          setBoxState("eye-open");
        }, "+=0.2")
        .add(() => {
          setShowTooltip(true);
          setScrambleActive(true);
          setShowScanline(true);
          triggerGlitch();
        }, "+=0.3")
        .add(pause(2))
        .add(() => {
          setShowScanline(false);
        })
        .add(pause(0.2))
        .add(() => {
          setShowTooltip(false);
          setScrambleActive(false);
        })
        .add(pause(0.6));

      return tl;
    };

    const startPos = getRandomPos();
    gsap.set(box, { x: startPos.x, y: startPos.y });
    updateCoordLabels(startPos.x, startPos.y);

    timelineRef.current = runCycle();

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [getRandomPos, updateCoordLabels, triggerGlitch]);

  const scrambledText = useScramble("SECRET ROTATED", scrambleActive, () => {
    setBoxState("secured");
  });

  return (
    <div
      ref={canvasRef}
      className="relative w-full aspect-[966/602] overflow-hidden rounded-[10px]"
      style={{
        background: "radial-gradient(ellipse at center, #1a1a1a 0%, #111111 100%)",
      }}
    >
      {/* SVG noise filter */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        style={{ opacity: 0.04, mixBlendMode: "overlay" }}
      >
        <filter id="hero-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-noise)" />
      </svg>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Grid lines */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Grid opacity pulse */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          animation: "gridPulse 4s ease-in-out infinite",
        }}
      />

      {/* Glitch flash */}
      {glitchOpacity > 0 && (
        <div
          className="absolute inset-0 z-30 pointer-events-none"
          style={{ backgroundColor: "#CCFF00", opacity: glitchOpacity }}
        />
      )}

      {/* Scanline sweep */}
      <AnimatePresence>
        {showScanline && (
          <motion.div
            key="scanline"
            className="absolute left-0 right-0 h-[3px] z-[25] pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, transparent, rgba(204,255,0,0.25), transparent)",
            }}
            initial={{ top: "-10px" }}
            animate={{ top: "100%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "linear" }}
          />
        )}
      </AnimatePresence>

      {/* Corner labels */}
      <span
        ref={posLabelRef}
        className="absolute top-3 left-3 text-[10px] font-mono text-[#CCCCCC]/60 z-20"
      >
        POS 0, 0
      </span>
      <span className="absolute bottom-3 left-3 text-[10px] font-mono text-[#CCCCCC]/60 z-20">
        INVENTORIED 01
      </span>

      {/* Bottom right label */}
      <span className="absolute bottom-3 right-3 text-[9px] font-mono text-white/25 z-20 tracking-[0.15em] uppercase">
        TRUSTED BY THE BEST TEAMS IN THE WORLD
      </span>

      {/* Vault Box */}
      <div
        ref={boxRef}
        className="absolute z-20"
        style={{ width: "140px", height: "140px", top: 0, left: 0 }}
      >
        {/* Dashed selection overlay */}
        <div
          className="absolute inset-0 rounded-[4px] pointer-events-none"
          style={{ border: "1.5px dashed rgba(255,255,255,0.6)" }}
        />

        {/* Green background */}
        <div
          className="absolute inset-0 rounded-[4px] flex items-center justify-center"
          style={{
            backgroundColor: "#CCFF00",
            border: "2px solid #AAEE00",
          }}
        >
          <AnimatePresence mode="wait">
            {boxState === "eye-open" ? (
              <motion.div
                key="eye"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.25 }}
              >
                <EyeOpenIcon />
              </motion.div>
            ) : (
              <motion.div
                key="lock"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.25 }}
              >
                <LockIcon />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Corner handles */}
        <div className="absolute -top-[3px] -left-[3px] w-[7px] h-[7px] bg-white z-10 shadow-sm" />
        <div className="absolute -top-[3px] -right-[3px] w-[7px] h-[7px] bg-white z-10 shadow-sm" />
        <div className="absolute -bottom-[3px] -left-[3px] w-[7px] h-[7px] bg-white z-10 shadow-sm" />
        <div className="absolute -bottom-[3px] -right-[3px] w-[7px] h-[7px] bg-white z-10 shadow-sm" />
      </div>

      {/* Tooltip + Terminal */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            key="tooltip"
            className="absolute z-30 top-4 right-4"
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            {/* Tooltip card */}
            <div
              className="bg-white rounded-[4px] shadow-lg p-2 mb-2"
              style={{ border: "1px solid #E0E0E0" }}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[13px]">🔒</span>
                <span
                  className="text-[11px] font-mono font-bold uppercase"
                  style={{ color: "#22AA44" }}
                >
                  {scrambledText || "[SECRET ROTATED]"}
                </span>
              </div>
              <div className="text-[10px] font-mono uppercase mt-0.5" style={{ color: "#333" }}>
                [STRIPE-LIVE]
              </div>
            </div>

            {/* Terminal */}
            <div
              className="bg-black/80 rounded-[4px] p-2.5 backdrop-blur-sm"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            >
              {TERMINAL_LINES.map((line, i) => (
                <TerminalLine key={`${line.text}-${i}`} line={line} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS animations */}
      <style>{`
        @keyframes gridPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
