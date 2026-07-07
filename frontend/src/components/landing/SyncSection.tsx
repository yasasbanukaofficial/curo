import { useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
  { prefix: ">" as const, text: "No active session, sign in to continue", color: "text-[#8E8E93]" },
  { prefix: "\u2713" as const, text: "Signed in as yixbinfo@gmail.com", color: "text-[#248A3D] dark:text-[#30D158]" },
  { prefix: ">" as const, text: "", color: "text-[#1D1D1F] dark:text-white" },
  { prefix: "\u2713" as const, text: "", color: "text-[#248A3D] dark:text-[#30D158]" },
];

function CuroWordmark() {
  return (
    <pre className="font-mono text-[6px] leading-[1.15] text-center select-none">
      <span className="text-[#1D1D1F] dark:text-[#E5E5EA]">██████╗██╗   ██╗██████╗  ██████╗ </span><br />
      <span className="text-[#1D1D1F] dark:text-[#E5E5EA]">██╔════╝██║   ██║██╔══██╗██╔═══██╗</span><br />
      <span className="text-[#D1D1D6] dark:text-[#2C2C2E]">██║     ██║   ██║██████╔╝██║   ██║</span><br />
      <span className="text-[#D1D1D6] dark:text-[#2C2C2E]">██║     ██║   ██║██╔══██╗██║   ██║</span><br />
      <span className="text-[#1D1D1F] dark:text-[#E5E5EA]">╚██████╗╚██████╔╝██║  ██║╚██████╔╝</span><br />
      <span className="text-[#1D1D1F] dark:text-[#E5E5EA]"> ╚═════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ </span>
    </pre>
  );
}

function TerminalWindow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full bg-white dark:bg-[#111113] border border-[#E5E5EA] dark:border-[#2C2C2E] rounded-2xl shadow-lg overflow-hidden">
      <div className="p-2">
        <div className="flex flex-row gap-2">
          <h2 className="text-accent content-center font-mono font-bold uppercase border-2 border-accent/50 px-2 rounded-xl text-xs leading-loose">
            Try it out
          </h2>
          <figure className="rounded-xl relative border border-[#E5E5EA] dark:border-[#2C2C2E] shadow-sm overflow-hidden text-sm flex-1 bg-[#F5F5F7] dark:bg-[#18181B]">
            <div className="py-1.5 px-3 overflow-auto">
              <pre className="font-mono text-xs">
                <code>
                  <span style={{ color: "#B392F0" }}>curo</span>
                  <span style={{ color: "#9ECBFF" }}> login</span>
                </code>
              </pre>
            </div>
          </figure>
        </div>
      </div>
      <div className="relative bg-[#F5F5F7] dark:bg-[#18181B] rounded-xl mx-2 mb-2 border border-[#E5E5EA] dark:border-[#2C2C2E] shadow-md">
        <div className="flex flex-row items-center gap-2 border-b border-[#E5E5EA] dark:border-[#2C2C2E] p-2 text-[#8E8E93] dark:text-[#6E6E73]">
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19h8" />
            <path d="m4 17 6-6-6-6" />
          </svg>
          <span className="text-xs font-medium">Terminal</span>
          <div className="ms-auto me-2 size-2 rounded-full bg-accent" />
        </div>
        <div className="p-2">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function SyncSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const logLinesRef = useRef<(HTMLDivElement | null)[]>([]);
  const logTextRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const stateARef = useRef<HTMLDivElement>(null);
  const stateARowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const stateAPromptsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const stateACmdsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const stateAWrapRef = useRef<HTMLDivElement>(null);
  const stateBRef = useRef<HTMLDivElement>(null);
  const stateBRowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const stateBPromptsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const stateBCmdsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const stateCWrapRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useGSAP(() => {
    if (reduced) return;
    const panel = panelRef.current;
    if (!panel) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: panel, start: "top 85%", once: true },
        defaults: { duration: 0.2, ease: "power2.out", force3D: true },
      });

      const logs = logLinesRef.current.filter(Boolean) as HTMLDivElement[];
      const logTexts = logTextRefs.current.filter(Boolean) as HTMLSpanElement[];
      const stateARows = stateARowsRef.current.filter(Boolean) as HTMLDivElement[];
      const stateAPrompts = stateAPromptsRef.current.filter(Boolean) as HTMLSpanElement[];
      const stateACmds = stateACmdsRef.current.filter(Boolean) as HTMLSpanElement[];
      const stateBRows = stateBRowsRef.current.filter(Boolean) as HTMLDivElement[];
      const stateBPrompts = stateBPromptsRef.current.filter(Boolean) as HTMLSpanElement[];
      const stateBCmds = stateBCmdsRef.current.filter(Boolean) as HTMLSpanElement[];

      const applyStyles = (el: HTMLElement | null, styles: Partial<CSSStyleDeclaration & { textContent?: string }>) => {
        if (!el) return;
        for (const key in styles) {
          if (key === "textContent") {
            el.textContent = styles[key] as string;
          } else {
            el.style[key as any] = styles[key] as string;
          }
        }
      };

      const hiliteCmd = (i: number, on: boolean) => {
        gsap.set(stateARows[i], { backgroundColor: on ? "rgba(100,210,255,0.1)" : "transparent" });
        gsap.set(stateACmds[i], { color: on ? "#64D2FF" : "#8E8E93" });
        applyStyles(stateAPrompts[i], { color: on ? "#64D2FF" : "#8E8E93", textContent: on ? "\u276F" : " " });
      };

      const hiliteAction = (i: number, on: boolean) => {
        gsap.set(stateBRows[i], { backgroundColor: on ? "rgba(100,210,255,0.1)" : "transparent" });
        gsap.set(stateBCmds[i], { color: on ? "#64D2FF" : "#8E8E93" });
        applyStyles(stateBPrompts[i], { color: on ? "#64D2FF" : "#8E8E93", textContent: on ? "\u276F" : " " });
      };

      const clickCmd = (i: number) => {
        const row = stateARows[i];
        if (!row) return;
        tl.to(row, { scale: 0.97, duration: 0.08, ease: "power2.in", force3D: true }, "+=0.05")
          .to(row, { scale: 1, duration: 0.15, ease: "power2.out", force3D: true });
      };

      const clickAction = (i: number) => {
        const row = stateBRows[i];
        if (!row) return;
        tl.to(row, { scale: 0.97, duration: 0.08, ease: "power2.in", force3D: true }, "+=0.05")
          .to(row, { scale: 1, duration: 0.15, ease: "power2.out", force3D: true });
      };

      tl.fromTo(panel, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });

      if (wordmarkRef.current) {
        tl.fromTo(
          wordmarkRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" },
          "-=0.1"
        );
      }

      if (logs.length >= 2) {
        tl.fromTo(logs.slice(0, 2), { opacity: 0, y: -4 }, { opacity: 1, y: 0, duration: 0.2, stagger: 0.15, ease: "power2.out" }, "+=0.15");
      }

      if (stateARef.current) {
        tl.fromTo(stateARef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, "+=0.1");
      }

      if (stateARows.length > 0) {
        tl.fromTo(
          stateARows,
          { opacity: 0, x: -4 },
          { opacity: 1, x: 0, duration: 0.2, stagger: 0.04, ease: "power2.out" },
          "-=0.1"
        );
      }

      tl.call(() => hiliteCmd(1, true), [], null, "+=0.2");

      tl.call(() => hiliteCmd(1, false), [], null, "+=0.6");
      tl.call(() => hiliteCmd(2, true), [], null, "+=0");

      tl.call(() => hiliteCmd(2, false), [], null, "+=0.6");
      tl.call(() => hiliteCmd(1, true), [], null, "+=0");

      tl.call(() => clickCmd(1), [], null, "+=0.4");

      if (logs.length >= 3 && logTexts.length >= 3) {
        tl.to(logs[2], { opacity: 0, duration: 0.05 }, "+=0.1");
        tl.call(() => { logTexts[2].textContent = "Selected project: CURO API"; });
        tl.to(logs[2], { opacity: 1, duration: 0.2 }, "+=0.05");
      }

      tl.to({}, { duration: 0.3 });

      if (stateAWrapRef.current && stateBRef.current) {
        tl.to(stateAWrapRef.current, { opacity: 0, scale: 0.97, duration: 0.2, ease: "power2.in" });
        tl.set(stateAWrapRef.current, { display: "none" });
        tl.set(stateBRef.current, { display: "block" });
        tl.fromTo(
          stateBRef.current,
          { opacity: 0, scale: 0.97 },
          { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" },
          "+=0.05"
        );
      }

      tl.call(() => hiliteAction(0, true), [], null, "+=0.2");

      tl.call(() => hiliteAction(0, false), [], null, "+=0.6");
      tl.call(() => hiliteAction(1, true), [], null, "+=0");

      tl.call(() => hiliteAction(1, false), [], null, "+=0.6");
      tl.call(() => hiliteAction(0, true), [], null, "+=0");

      tl.call(() => clickAction(0), [], null, "+=0.4");

      tl.to({}, { duration: 0.3 });

      if (logs.length >= 4 && logTexts.length >= 4) {
        tl.call(() => { logTexts[3].textContent = "Pulled secrets to .env, 3 variables synced"; });
        tl.fromTo(logs[3], { opacity: 0, y: -4 }, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }, "+=0.1");
      }

      if (stateBRef.current && stateCWrapRef.current) {
        tl.to(stateBRef.current, { opacity: 0, scale: 0.97, duration: 0.2, ease: "power2.in" }, "+=0.25");
        tl.set(stateBRef.current, { display: "none" });
        tl.set(stateCWrapRef.current, { display: "block" });
        tl.fromTo(
          stateCWrapRef.current,
          { opacity: 0, scale: 0.97 },
          { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" },
          "+=0.05"
        );
      }

      tl.to({}, { duration: 0.5 });
    }, panel);

    return () => ctx.revert();
  }, [reduced]);

  const stateA = (
    <>
      <div ref={stateARef} className="border border-[#E5E5EA] dark:border-[#2C2C2E] rounded-[10px] overflow-hidden bg-white/60 dark:bg-[#111113]/60" style={{ willChange: "transform, opacity", backfaceVisibility: "hidden" }}>
        <div className="px-3 py-2 border-b border-[#E5E5EA] dark:border-[#2C2C2E] flex items-center gap-2">
          <span className="text-accent text-[11px] font-mono">❯</span>
          <span className="text-[#1D1D1F] dark:text-[#E5E5EA] text-[11px] font-mono flex-1">
            <span ref={cursorRef} className="inline-block w-[2px] h-3 bg-[#E5E5EA] align-middle ml-0.5 blinking-cursor" />
          </span>
        </div>
        <div className="py-0.5">
          {commands.map((cmd, i) => (
            <div
              key={i}
              ref={(el) => { stateARowsRef.current[i] = el; }}
              className="flex items-center gap-2 px-3 py-1.5"
            >
              <span ref={(el) => { stateAPromptsRef.current[i] = el; }} className="text-[11px] font-mono text-[#8E8E93] dark:text-[#8E8E93] w-3 text-center"> </span>
              <span ref={(el) => { stateACmdsRef.current[i] = el; }} className="text-[11px] font-mono text-[#8E8E93] dark:text-[#8E8E93]">{cmd.cmd}</span>
              <span className="text-[10px] text-[#AEAEB2] dark:text-[#6E6E73] font-mono">{cmd.desc}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-[#E5E5EA] dark:border-[#2C2C2E] px-3 py-1 text-[10px] text-[#AEAEB2] dark:text-[#6E6E73] font-mono">
          <span className="text-[#8E8E93] dark:text-[#8E8E93]">4</span> commands
        </div>
      </div>
      <div className="flex justify-center mt-2">
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#AEAEB2] dark:text-[#6E6E73]">
          <span className="text-[#8E8E93]">type <kbd className="px-1 py-0.5 rounded bg-[#F5F5F7] dark:bg-[#18181B] text-[#1D1D1F] dark:text-[#E5E5EA] text-[9px] border border-[#E5E5EA] dark:border-[#2C2C2E]">/</kbd> for commands</span>
          <span className="text-[#C7C7CC] dark:text-[#8E8E93]">·</span>
          <span><kbd className="px-1 py-0.5 rounded bg-[#F5F5F7] dark:bg-[#18181B] text-[#1D1D1F] dark:text-[#E5E5EA] text-[9px] border border-[#E5E5EA] dark:border-[#2C2C2E]">↑↓</kbd> navigate</span>
          <span className="text-[#C7C7CC] dark:text-[#8E8E93]">·</span>
          <span><kbd className="px-1 py-0.5 rounded bg-[#F5F5F7] dark:bg-[#18181B] text-[#1D1D1F] dark:text-[#E5E5EA] text-[9px] border border-[#E5E5EA] dark:border-[#2C2C2E]">⏎</kbd> select</span>
          <span className="text-[#C7C7CC] dark:text-[#8E8E93]">·</span>
          <span><kbd className="px-1 py-0.5 rounded bg-[#F5F5F7] dark:bg-[#18181B] text-[#1D1D1F] dark:text-[#E5E5EA] text-[9px] border border-[#E5E5EA] dark:border-[#2C2C2E]">esc</kbd> clear</span>
        </div>
      </div>
      <div className="flex justify-center mt-1.5">
        <span className="flex items-center gap-1.5 text-[10px] font-mono text-[#AEAEB2] dark:text-[#6E6E73]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FEBC2E] inline-block animate-pulse" />
          Tip Try <span className="text-[#8E8E93] dark:text-[#8E8E93]">/projects</span> to browse projects
        </span>
      </div>
    </>
  );

  const stateB = (
    <>
      <div className="border border-[#E5E5EA] dark:border-[#2C2C2E] rounded-[10px] overflow-hidden bg-white/60 dark:bg-[#111113]/60" style={{ willChange: "transform, opacity", backfaceVisibility: "hidden" }}>
        <div className="py-0.5">
          {secrets.map((secret, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-1.5">
              <span className="text-[11px] font-mono text-[#1D1D1F] dark:text-[#E5E5EA]">{secret.key}</span>
              <span className="text-[11px] font-mono text-[#AEAEB2] dark:text-[#6E6E73] tracking-wider">••••••••</span>
            </div>
          ))}
        </div>
        <div className="border-t border-[#E5E5EA] dark:border-[#2C2C2E]" />
        <div className="py-0.5">
          {actions.map((action, i) => (
            <div
              key={i}
              ref={(el) => { stateBRowsRef.current[i] = el; }}
              className="flex items-center gap-2 px-3 py-1.5"
            >
              <span ref={(el) => { stateBPromptsRef.current[i] = el; }} className="text-[11px] font-mono text-[#8E8E93] dark:text-[#8E8E93] w-3 text-center"> </span>
              <span ref={(el) => { stateBCmdsRef.current[i] = el; }} className="text-[11px] font-mono text-[#8E8E93] dark:text-[#8E8E93]">{action.cmd}</span>
              <span className="text-[10px] text-[#AEAEB2] dark:text-[#6E6E73] font-mono">{action.desc}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-2">
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#AEAEB2] dark:text-[#6E6E73]">
          <span><kbd className="px-1 py-0.5 rounded bg-[#F5F5F7] dark:bg-[#18181B] text-[#1D1D1F] dark:text-[#E5E5EA] text-[9px] border border-[#E5E5EA] dark:border-[#2C2C2E]">↑↓</kbd> navigate</span>
          <span className="text-[#C7C7CC] dark:text-[#8E8E93]">·</span>
          <span><kbd className="px-1 py-0.5 rounded bg-[#F5F5F7] dark:bg-[#18181B] text-[#1D1D1F] dark:text-[#E5E5EA] text-[9px] border border-[#E5E5EA] dark:border-[#2C2C2E]">⏎</kbd> run</span>
          <span className="text-[#C7C7CC] dark:text-[#8E8E93]">·</span>
          <span><kbd className="px-1 py-0.5 rounded bg-[#F5F5F7] dark:bg-[#18181B] text-[#1D1D1F] dark:text-[#E5E5EA] text-[9px] border border-[#E5E5EA] dark:border-[#2C2C2E]">esc</kbd> cancel</span>
        </div>
      </div>
    </>
  );

  const stateC = (
    <div className="border border-[#E5E5EA] dark:border-[#2C2C2E] rounded-[10px] overflow-hidden bg-white/60 dark:bg-[#111113]/60" style={{ willChange: "transform, opacity", backfaceVisibility: "hidden" }}>
      <div className="flex items-center gap-2 px-3 py-2 bg-[#F5F5F7] dark:bg-[#18181B] border-b border-[#E5E5EA] dark:border-[#2C2C2E]">
        <svg className="w-3 h-3 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <span className="text-[10px] font-mono text-[#1D1D1F] dark:text-[#E5E5EA]">.env</span>
        <span className="ml-auto text-[9px] text-[#AEAEB2] dark:text-[#6E6E73] font-mono">readonly</span>
      </div>
      <div className="py-2 px-3 font-mono text-[11px] space-y-[3px]">
        {secrets.map((secret, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[9px] text-[#AEAEB2] dark:text-[#6E6E73] w-5 text-right select-none">{i + 1}</span>
            <span className="text-accent">{secret.key}</span>
            <span className="text-[#AEAEB2] dark:text-[#6E6E73]">=</span>
            <span className="text-[#8E8E93] dark:text-[#8E8E93]">&quot;••••••••&quot;</span>
          </div>
        ))}
      </div>
      <div className="border-t border-[#E5E5EA] dark:border-[#2C2C2E] px-3 py-1 flex items-center gap-3 text-[10px] font-mono text-[#AEAEB2] dark:text-[#6E6E73]">
        <span><span className="text-[#8E8E93] dark:text-[#8E8E93]">3</span> variables</span>
        <span className="text-[#30D158]">synced</span>
      </div>
    </div>
  );

  const panelContent = (
    <TerminalWindow>
      <div ref={panelRef} style={{ willChange: "transform, opacity", backfaceVisibility: "hidden" }}>
        <div ref={wordmarkRef} className="flex justify-center mb-3">
          <CuroWordmark />
        </div>

        <div ref={logRef} className="space-y-[2px] mb-3">
          {logLines.map((line, i) => (
            <div
              key={i}
              ref={(el) => { logLinesRef.current[i] = el; }}
              className="flex items-center gap-2 text-[11px] font-mono"
              style={i >= 2 ? { opacity: 0 } : undefined}
            >
              <span className={line.prefix === "\u2713" ? "text-[#30D158]" : "text-[#8E8E93]"}>
                {line.prefix === ">" ? "\u276F" : line.prefix}
              </span>
              <span ref={(el) => { logTextRefs.current[i] = el; }} className={line.color}>{line.text}</span>
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
          <div ref={stateCWrapRef} className="absolute inset-0 hidden">
            {stateC}
          </div>
        </div>

        <div className="flex justify-between items-center mt-3 pt-2 border-t border-[#E5E5EA] dark:border-[#2C2C2E]">
          <span className="text-[9px] font-mono text-[#AEAEB2] dark:text-[#6E6E73]">curo</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#30D158] inline-block" />
            <span className="text-[9px] font-mono text-[#AEAEB2] dark:text-[#6E6E73]">connected</span>
          </div>
          <span className="text-[9px] font-mono text-[#AEAEB2] dark:text-[#6E6E73]">v1.0.0</span>
        </div>
      </div>
    </TerminalWindow>
  );

  return (
    <section id="sync" ref={sectionRef} className="relative bg-white dark:bg-black scroll-mt-24 py-8 lg:py-12">
      <div className="mx-auto max-w-[1400px] px-8 sm:px-10 lg:px-14 py-16 lg:py-24 relative">
        <StaggerContainer className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          <motion.div variants={scaleFadeIn()} className="flex-1 max-w-lg">
            <div className="text-accent text-xs uppercase font-bold tracking-widest mb-3">Sync</div>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight text-black dark:text-white leading-[1.15] mb-4">
              Developer<br />workflow first.
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-black/70 dark:text-white/70 leading-relaxed mb-4">
              Sign in, pick a project, and pull secrets straight into your .env all from one interactive terminal session.
            </p>
          </motion.div>
          <ParallaxDrift drift={3} className="flex-1 max-w-lg w-full">
            <motion.div variants={scaleFadeIn()}>
              {panelContent}
            </motion.div>
          </ParallaxDrift>
        </StaggerContainer>
      </div>
      <style>{`
        .blinking-cursor {
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
