import { useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DotsLine from "./DotsLine";
import Corner from "./Corner";
import StaggerContainer, { scaleFadeIn } from "../animations/StaggerContainer";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import ParallaxDrift from "./ParallaxDrift";

gsap.registerPlugin(ScrollTrigger);

const commands = [
  { cmd: "/login", desc: "Sign in to your Curo account" },
  { cmd: "/projects", desc: "Browse and select projects" },
  { cmd: "/settings", desc: "Configure your preferences" },
  { cmd: "/logout", desc: "End current session" },
];

const secrets = [
  { key: "API_KEY", masked: true },
  { key: "BASE_URL", masked: true },
  { key: "ADMIN_URL", masked: true },
];

const actions = [
  { cmd: "pull .env", desc: "write secrets to .env file" },
  { cmd: "refresh", desc: "reload secrets from server" },
  { cmd: "back", desc: "return to projects list" },
];

const logLines = [
  { prefix: ">" as const, text: "No active session — sign in to continue", color: "text-[#8E8E93]" },
  { prefix: "✓" as const, text: "Signed in as yixbinfo@gmail.com", color: "text-[#30D158]" },
  { prefix: ">" as const, text: "Selected project: CURO API", color: "text-white" },
];

function CuroWordmark() {
  return (
    <div className="relative inline-flex select-none">
      <span
        className="text-[#2C2C2E] text-xl font-bold tracking-[0.15em] font-mono absolute top-[1px] left-[1px]"
        aria-hidden="true"
      >
        CURO
      </span>
      <span className="text-white text-xl font-bold tracking-[0.15em] font-mono relative">
        CURO
      </span>
    </div>
  );
}

export default function SyncSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const logLinesRef = useRef<(HTMLDivElement | null)[]>([]);
  const stateARef = useRef<HTMLDivElement>(null);
  const stateARowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const stateAWrapRef = useRef<HTMLDivElement>(null);
  const stateBRef = useRef<HTMLDivElement>(null);
  const stateBRowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const tipDotRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useGSAP(() => {
    if (reduced) return;
    const panel = panelRef.current;
    if (!panel) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: panel, start: "top 85%", once: true },
      });

      tl.fromTo(panel, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });

      if (wordmarkRef.current) {
        tl.fromTo(wordmarkRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }, "-=0.1");
      }

      const logs = logLinesRef.current.filter(Boolean) as HTMLDivElement[];
      if (logs.length > 0) {
        tl.fromTo(
          logs,
          { opacity: 0, y: -4 },
          { opacity: 1, y: 0, duration: 0.2, stagger: 0.15, ease: "power2.out" },
          "+=0.15"
        );
      }

      if (stateARef.current) {
        tl.fromTo(stateARef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, "+=0.1");
      }

      const stateARows = stateARowsRef.current.filter(Boolean) as HTMLDivElement[];
      if (stateARows.length > 0) {
        tl.fromTo(
          stateARows,
          { opacity: 0, x: -4 },
          { opacity: 1, x: 0, duration: 0.2, stagger: 0.04, ease: "power2.out" },
          "-=0.1"
        );
      }

      tl.to({}, { duration: 0.7 });

      if (stateAWrapRef.current && stateBRef.current) {
        tl.to(stateAWrapRef.current, { opacity: 0, scale: 0.97, duration: 0.2, ease: "power2.in" }, "+=0.1");
        tl.set(stateAWrapRef.current, { display: "none" });
        tl.set(stateBRef.current, { display: "block" });
        tl.fromTo(stateBRef.current, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }, "+=0.05");
      }

      if (logs.length >= 3) {
        tl.to(logs[2], { opacity: 0, duration: 0.1 }, "+=0");
        tl.set(logs[2], { textContent: "> Selected project: CURO API" });
        tl.to(logs[2], { opacity: 1, duration: 0.2 }, "+=0.05");
      }

      const stateBRows = stateBRowsRef.current.filter(Boolean) as HTMLDivElement[];
      if (stateBRows.length > 0) {
        tl.fromTo(
          stateBRows,
          { opacity: 0, x: -4 },
          { opacity: 1, x: 0, duration: 0.2, stagger: 0.04, ease: "power2.out" },
          "+=0.1"
        );
      }

      tl.to({}, { duration: 0.3 });
    }, panel);

    return () => ctx.revert();
  }, [reduced]);

  const stateA = (
    <>
      <div ref={stateARef} className="border border-[#2C2C2E] rounded-[10px] overflow-hidden bg-[#14141a]/60">
        <div className="px-3 py-2 border-b border-[#2C2C2E] flex items-center gap-2">
          <span className="text-[#8E8E93] text-[11px] font-mono">/</span>
          <span className="text-[#E5E5EA] text-[11px] font-mono flex-1">
            <span ref={cursorRef} className="inline-block w-[2px] h-3 bg-[#E5E5EA] align-middle ml-0.5" />
          </span>
        </div>
        <div className="py-0.5">
          {commands.map((cmd, i) => (
            <div
              key={i}
              ref={(el) => { stateARowsRef.current[i] = el; }}
              className={`flex items-center gap-2 px-3 py-1.5 ${i === 1 ? "bg-[#64D2FF]/10" : ""}`}
            >
              <span className={`text-[11px] font-mono ${i === 1 ? "text-[#64D2FF]" : "text-[#8E8E93]"}`}>
                {i === 1 ? ">" : " "} {cmd.cmd}
              </span>
              <span className="text-[10px] text-[#6E6E73] font-mono">{cmd.desc}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-[#2C2C2E] px-3 py-1 text-[10px] text-[#6E6E73] font-mono">
          4 commands
        </div>
      </div>
      <div className="flex justify-center mt-2">
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#6E6E73]">
          <span><span className="text-[#8E8E93]">type / for commands</span></span>
          <span className="text-[#8E8E93]">·</span>
          <span><span className="text-[#8E8E93]">↑↓</span> navigate</span>
          <span className="text-[#8E8E93]">·</span>
          <span><span className="text-[#8E8E93]">enter</span> select</span>
          <span className="text-[#8E8E93]">·</span>
          <span><span className="text-[#8E8E93]">esc</span> clear</span>
        </div>
      </div>
      <div className="flex justify-center mt-1.5">
        <span className="flex items-center gap-1.5 text-[10px] font-mono text-[#6E6E73]">
          <span ref={tipDotRef} className="w-1.5 h-1.5 rounded-full bg-[#FEBC2E] inline-block" />
          Tip Try <span className="text-[#8E8E93]">/projects</span> to browse projects
        </span>
      </div>
    </>
  );

  const stateB = (
    <>
      <div className="border border-[#2C2C2E] rounded-[10px] overflow-hidden bg-[#14141a]/60">
        <div className="py-0.5">
          {secrets.map((secret, i) => (
            <div
              key={i}
              ref={(el) => { stateBRowsRef.current[i] = el; }}
              className="flex items-center gap-3 px-3 py-1.5"
            >
              <span className="text-[11px] font-mono text-[#E5E5EA]">{secret.key}</span>
              <span className="text-[11px] font-mono text-[#6E6E73] tracking-wider">••••••••</span>
            </div>
          ))}
        </div>
        <div className="border-t border-[#2C2C2E]" />
        <div className="py-0.5">
          {actions.map((action, i) => (
            <div
              key={i}
              ref={(el) => { stateBRowsRef.current[secrets.length + i] = el; }}
              className={`flex items-center gap-2 px-3 py-1.5 ${i === 0 ? "bg-[#64D2FF]/10" : ""}`}
            >
              <span className={`text-[11px] font-mono ${i === 0 ? "text-[#64D2FF]" : "text-[#8E8E93]"}`}>
                {i === 0 ? ">" : " "} {action.cmd}
              </span>
              <span className="text-[10px] text-[#6E6E73] font-mono">{action.desc}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-2">
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#6E6E73]">
          <span><span className="text-[#8E8E93]">↑↓</span> navigate</span>
          <span className="text-[#8E8E93]">·</span>
          <span><span className="text-[#8E8E93]">enter</span> run</span>
          <span className="text-[#8E8E93]">·</span>
          <span><span className="text-[#8E8E93]">esc</span> cancel</span>
        </div>
      </div>
    </>
  );

  const panelContent = (
    <div ref={panelRef} className="bg-[#14141a] w-full rounded-[14px] shadow-[0_20px_50px_rgba(0,0,0,0.35)] overflow-hidden border border-[#2C2C2E]/50 p-4">
      <div ref={wordmarkRef} className="flex justify-center mb-3">
        <CuroWordmark />
      </div>

      <div ref={logRef} className="space-y-[2px] mb-3">
        {logLines.map((line, i) => (
          <div
            key={i}
            ref={(el) => { logLinesRef.current[i] = el; }}
            className="flex items-center gap-2 text-[11px] font-mono"
          >
            <span className={line.prefix === "✓" ? "text-[#30D158]" : "text-[#8E8E93]"}>
              {line.prefix}
            </span>
            <span className={line.color}>{line.text}</span>
          </div>
        ))}
      </div>

      <div className="relative" style={{ minHeight: "210px" }}>
        <div ref={stateAWrapRef}>
          {stateA}
        </div>
        <div ref={stateBRef} className="absolute inset-0 hidden">
          {stateB}
        </div>
      </div>

      <div className="flex justify-between items-center mt-3 pt-2 border-t border-[#2C2C2E]">
        <span className="text-[9px] font-mono text-[#6E6E73]">curo</span>
        <span className="text-[9px] font-mono text-[#6E6E73]">v1.0.0</span>
      </div>
    </div>
  );

  return (
    <section id="sync" ref={sectionRef} className="relative bg-[#fcfcfc] scroll-mt-24">
      <DotsLine className="h-10" />
      <div className="border-x border-[#efefef] mx-auto max-w-[1400px] px-8 sm:px-10 lg:px-14 py-16 lg:py-24 relative">
        <Corner />
        <StaggerContainer className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          <motion.div variants={scaleFadeIn()} className="flex-1 max-w-lg">
            <div className="text-[#1D1D1F] text-xs uppercase font-bold tracking-widest mb-3">Sync</div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#1D1D1F] leading-[1.1] mb-4">
              Developer<br />workflow first.
            </h2>
            <p className="text-sm sm:text-base text-[#6E6E73] leading-relaxed mb-4">
              Sign in, pick a project, and pull secrets straight into your .env — all from one interactive terminal session.
            </p>
          </motion.div>
          <ParallaxDrift drift={3} className="flex-1 max-w-lg w-full">
            <motion.div variants={scaleFadeIn()}>
              {panelContent}
            </motion.div>
          </ParallaxDrift>
        </StaggerContainer>
      </div>
      <DotsLine className="h-10" />
    </section>
  );
}
