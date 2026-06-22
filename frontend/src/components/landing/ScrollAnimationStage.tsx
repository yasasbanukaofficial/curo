import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { motion, AnimatePresence } from 'framer-motion';
import Corner from "./Corner";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export default function ScrollAnimationStage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [currentAct, setCurrentAct] = useState(1);
  const [_, setScrollProgress] = useState(0);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
          onUpdate: (self) => {
            const p = self.progress;
            setScrollProgress(p);
            if (p < 0.25) setCurrentAct(1);
            else if (p < 0.45) setCurrentAct(2);
            else if (p < 0.8) setCurrentAct(3);
            else setCurrentAct(4);
            
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${p * 100}%`;
            }
          }
        }
      });

      // --- ACT 1: The Old Way (0% - 20%) ---
      // Initial states
      gsap.set('.act1-card', { x: -60, opacity: 0 });
      gsap.set('.act1-strikethrough', { scaleX: 0, transformOrigin: 'left center' });
      
      // Ambient breathing loop
      gsap.to('.act1-card', {
        rotation: 1,
        yoyo: true,
        repeat: -1,
        duration: 2,
        ease: 'sine.inOut',
        stagger: 0.2
      });

      // Animate in
      tl.to('.act1-card', { x: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power2.out' }, 0);
      tl.to('.act1-strikethrough', { scaleX: 1, duration: 1.5, ease: 'power2.inOut' }, 0.5);

      // --- ACT 2: The Transition (20% - 40%) ---
      tl.to('.act1-card', { scale: 0.6, filter: 'blur(8px)', opacity: 0, duration: 1, ease: 'power2.inOut' }, 2);
      tl.to('.act1-strikethrough', { scaleX: 0, opacity: 0, duration: 0.2, ease: 'power2.inOut' }, 2);
      
      // Particles converge
      gsap.set('.particle', { opacity: 0, scale: 0 });
      tl.to('.particle', {
        opacity: 1,
        scale: 1,
        duration: 0.2,
        stagger: 0.02
      }, 2.5);
      tl.to('.particle', {
        x: 0,
        y: 0,
        opacity: 0,
        duration: 1,
        stagger: 0.02,
        ease: 'power3.in'
      }, 2.7);

      // Vault materializes
      gsap.set('.act2-vault', { scale: 0.4, opacity: 0 });
      tl.to('.act2-vault', { scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.5)' }, 3.2);

      // --- ACT 3: The New Way (40% - 80%) ---
      // Expand into dashboard card
      gsap.set('.act3-dashboard', { scaleX: 0.3, scaleY: 0.3, opacity: 0, borderRadius: '24px' });
      tl.to('.act2-vault', { opacity: 0, duration: 0.2 }, 4.5);
      tl.to('.act3-dashboard', { opacity: 1, scaleX: 1, scaleY: 1, duration: 1.2, ease: 'elastic.out(1, 0.75)' }, 4.5);
      
      // Secret rows type in
      gsap.set('.secret-row', { opacity: 0, x: -10 });
      tl.to('.secret-row', { opacity: 1, x: 0, duration: 0.5, stagger: 0.2 }, 5.2);
      
      // Checkmarks pop in
      gsap.set('.check-sync', { scale: 0 });
      tl.to('.check-sync', { scale: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(2)' }, 5.8);

      // Avatars and lines appear
      gsap.set('.avatar-orbit', { opacity: 0 });
      gsap.set('.connect-line', { strokeDashoffset: 100, strokeDasharray: 100 });
      tl.to('.avatar-orbit', { opacity: 1, duration: 0.5 }, 6);
      tl.to('.connect-line', { strokeDashoffset: 0, duration: 1, ease: 'power1.inOut' }, 6.2);

      // Start Orbiting (Continuous)
      gsap.to('.avatar-orbit-container', {
        rotation: 360,
        repeat: -1,
        duration: 20,
        ease: 'none'
      });
      // Counter-rotate avatars to keep them upright
      gsap.to('.avatar-orbit', {
        rotation: -360,
        repeat: -1,
        duration: 20,
        ease: 'none'
      });

      // --- ACT 4: The Payoff (80% - 100%) ---
      tl.to('.act3-dashboard', { scale: 1.04, y: -12, duration: 1, ease: 'power2.out' }, 8);
      tl.to('.white-overlay', { opacity: 1, duration: 1 }, 8);
      
      // Terminal typing
      gsap.set('.act4-terminal', { opacity: 0 });
      tl.to('.act4-terminal', { opacity: 1, duration: 0.2 }, 8.5);
      // We will handle the typing effect with a simple text reveal
      gsap.set('.terminal-text', { width: 0 });
      tl.to('.terminal-text', { width: '100%', duration: 1, ease: 'steps(30)' }, 8.6);
      
      // CTA fade up
      gsap.set('.act4-cta', { opacity: 0, y: 16 });
      tl.to('.act4-cta', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 9.5);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="border-x border-[#efefef] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative">
      <Corner />
      <div ref={containerRef} className="relative w-full" style={{ height: '500vh' }}>
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center font-sans">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-[2px] bg-[#0071E3] z-50 transition-all duration-100 ease-out" ref={progressBarRef} style={{ width: '0%' }}></div>
        
        {/* White Overlay for Act 4 */}
        <div className="white-overlay absolute inset-0 bg-white/80 backdrop-blur-sm z-0 pointer-events-none opacity-0"></div>

        {/* Texts */}
        <div className="absolute top-20 left-10 md:left-20 z-40 max-w-md pointer-events-none">
          <AnimatePresence mode="wait">
            {currentAct === 1 && (
              <motion.div key="act1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: [0.25, 0, 0, 1] }}>
                <div className="text-[#FF3B30] text-xs uppercase font-bold tracking-widest mb-2">The old way</div>
                <h2 className="text-[48px] leading-[1.1] font-medium text-[#1D1D1F] tracking-tight">Secrets passed<br/>in messages.</h2>
              </motion.div>
            )}
            {currentAct === 2 && (
              <motion.div key="act2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: [0.25, 0, 0, 1] }}>
                <h2 className="text-[48px] leading-[1.1] font-medium text-[#1D1D1F] tracking-tight">One place.</h2>
              </motion.div>
            )}
            {currentAct === 3 && (
              <motion.div key="act3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: [0.25, 0, 0, 1] }}>
                <h2 className="text-[48px] leading-[1.1] font-medium text-[#1D1D1F] tracking-tight mb-4">Every secret.<br/>Synced instantly.</h2>
                <p className="text-[16px] text-[#6E6E73] leading-relaxed">No more .env files passed<br/>in Slack. Your whole team<br/>accesses secrets securely.</p>
              </motion.div>
            )}
            {currentAct === 4 && (
              <motion.div key="act4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: [0.25, 0, 0, 1] }} className="absolute top-[10vh] left-[50vw] -translate-x-[50vw] w-[100vw] flex justify-center">
                <h2 className="text-[32px] leading-[1.1] font-medium text-[#1D1D1F] tracking-tight text-center mt-[-40px]">Set up in 60 seconds.</h2>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Animation Stage */}
        <div ref={stageRef} className="relative w-full max-w-4xl h-[600px] flex items-center justify-center z-10">
          
          {/* ACT 1: Cards */}
          <div className="absolute flex gap-6 z-10 pointer-events-none">
            {/* Strikethrough line */}
            <div className="act1-strikethrough absolute top-1/2 left-[-10%] w-[120%] h-1 bg-[#FF3B30] z-20"></div>
            
            <div className="act1-card bg-[#F5F5F7] p-4 rounded-[16px] w-[200px] shadow-[0_2px_20px_rgba(0,0,0,0.06)] border border-white/50 relative">
              <div className="flex items-center gap-2 mb-3 text-[#1D1D1F] font-medium text-sm"><span className="text-xl">💬</span> Slack DM</div>
              <div className="text-xs text-[#6E6E73] font-mono leading-relaxed">
                hey here's the<br/>stripe key:<br/>
                <span className="text-[#1D1D1F] bg-gray-200 px-1 rounded">sk-live-...</span>
              </div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#FF3B30] rounded-full animate-ping opacity-75"></div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#FF3B30] rounded-full border-2 border-white"></div>
            </div>

            <div className="act1-card bg-[#F5F5F7] p-4 rounded-[16px] w-[200px] shadow-[0_2px_20px_rgba(0,0,0,0.06)] border border-white/50 relative mt-8">
              <div className="flex items-center gap-2 mb-3 text-[#1D1D1F] font-medium text-sm"><span className="text-xl">📧</span> Email</div>
              <div className="text-xs text-[#6E6E73] font-mono leading-relaxed">
                <span className="text-[#1D1D1F]">API_KEY=sk-...</span><br/>
                <span className="italic">(attached)</span>
              </div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#FF3B30] rounded-full border-2 border-white"></div>
            </div>

            <div className="act1-card bg-[#F5F5F7] p-4 rounded-[16px] w-[200px] shadow-[0_2px_20px_rgba(0,0,0,0.06)] border border-white/50 relative mt-[-20px]">
              <div className="flex items-center gap-2 mb-3 text-[#1D1D1F] font-medium text-sm"><span className="text-xl">📄</span> .env file</div>
              <div className="text-xs text-[#6E6E73] font-mono leading-relaxed">
                <span className="text-[#1D1D1F]">DB_PASS=hunter2</span><br/>
                <span className="italic">(committed 😬)</span>
              </div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#FF3B30] rounded-full border-2 border-white"></div>
            </div>
          </div>

          {/* ACT 2: Particles & Vault */}
          {Array.from({ length: 25 }).map((_, i) => {
            const angle = (i / 25) * Math.PI * 2;
            const r = 200 + Math.random() * 100;
            const startX = Math.cos(angle) * r;
            const startY = Math.sin(angle) * r;
            return (
              <div key={i} className="particle absolute w-1.5 h-1.5 bg-[#0071E3] rounded-full" style={{ left: '50%', top: '50%', transform: `translate(${startX}px, ${startY}px)` }}></div>
            );
          })}
          
          <div className="act2-vault absolute bg-[#F5F5F7] w-[120px] h-[120px] rounded-[32px] flex items-center justify-center shadow-[0_0_40px_rgba(0,113,227,0.2)] border border-white z-20">
            <svg className="w-12 h-12 text-[#1D1D1F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          {/* ACT 3: Dashboard Card & Orbits */}
          <div className="absolute w-[600px] h-[600px] pointer-events-none flex items-center justify-center z-10">
            <div className="avatar-orbit-container absolute w-full h-full rounded-full border border-dashed border-[#E5E5EA]">
              {/* Avatars */}
              <div className="avatar-orbit absolute top-0 left-1/2 -ml-6 -mt-6 w-12 h-12 rounded-full bg-[#F5F5F7] border-2 border-white shadow-sm flex items-center justify-center text-xs font-medium text-[#1D1D1F]">AK</div>
              <div className="avatar-orbit absolute bottom-1/4 -right-2 w-12 h-12 rounded-full bg-[#E8F2FF] border-2 border-white shadow-sm flex items-center justify-center text-xs font-medium text-[#0071E3]">SM</div>
              <div className="avatar-orbit absolute bottom-1/4 -left-2 w-12 h-12 rounded-full bg-[#E8F2FF] border-2 border-white shadow-sm flex items-center justify-center text-xs font-medium text-[#0071E3]">JR</div>
            </div>
          </div>

          <div className="act3-dashboard absolute bg-white w-[480px] rounded-[16px] shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-[#E5E5EA] overflow-hidden z-30">
            <div className="bg-[#F5F5F7] px-6 py-4 border-b border-[#E5E5EA] flex justify-between items-center">
              <div className="flex items-center gap-2 font-medium text-[#1D1D1F]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Production Secrets
              </div>
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#E5E5EA]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#E5E5EA]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#E5E5EA]"></div>
              </div>
            </div>
            <div className="p-6 space-y-4 font-mono text-sm">
              {[
                { key: 'STRIPE_SECRET_KEY' },
                { key: 'DATABASE_URL' },
                { key: 'OPENAI_API_KEY' },
                { key: 'JWT_SECRET' }
              ].map((secret, i) => (
                <div key={i} className="secret-row flex justify-between items-center">
                  <span className="text-[#6E6E73] w-1/3">{secret.key}</span>
                  <div className="secret-value relative flex-1 mx-4 h-6 rounded bg-[#F5F5F7] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#E5E5EA] via-[#F5F5F7] to-[#E5E5EA] w-[200%] animate-[shimmer_2s_linear_infinite]"></div>
                    <span className="absolute inset-0 flex items-center px-2 tracking-[0.2em] text-[#1D1D1F]">••••••••</span>
                  </div>
                  <div className="check-sync flex items-center gap-1 text-[#30D158] text-xs font-sans font-medium">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    sync
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-[#F5F5F7] px-6 py-3 border-t border-[#E5E5EA] text-xs text-[#6E6E73] flex items-center gap-2">
              <span className="text-[#0071E3]">⚡</span> Last synced: just now
            </div>
          </div>

          {/* ACT 4: Terminal & CTA */}
          <div className="act4-terminal absolute -bottom-16 w-[480px] z-30 font-mono text-sm">
            <div className="text-[#1D1D1F] flex relative overflow-hidden h-6 whitespace-nowrap terminal-text border-r-2 border-[#1D1D1F] animate-[blink_1s_step-end_infinite]">
              $ envsync pull --env production
            </div>
            <div className="text-[#30D158] mt-2 opacity-0 animate-[fadeIn_0.1s_ease-in_9.6s_forwards]">
              ✓ 12 secrets synced in 0.3s
            </div>
          </div>
          
          <div className="act4-cta absolute -bottom-40 z-40">
            <button className="bg-[#1D1D1F] text-white px-8 py-4 rounded-full font-medium text-lg hover:scale-105 transition-transform shadow-[0_4px_14px_0_rgba(0,0,0,0.39)]">
              Get Started for Free
            </button>
          </div>

        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        @keyframes blink {
          0%, 100% { border-color: transparent; }
          50% { border-color: #1D1D1F; }
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
      `}</style>
      </div>
    </div>
  );
}
