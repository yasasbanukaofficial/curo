import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { motion, AnimatePresence } from 'framer-motion';
import { SiNotion, SiSlack, SiGoogledocs, SiConfluence, SiGithub, SiLinear, SiVercel, SiRailway } from 'react-icons/si';
import { FaAws } from 'react-icons/fa';
import { PiFlask } from 'react-icons/pi';
import { Button } from '../ui/Button';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const tools = [
  { name: "Notion", icon: <SiNotion className="w-16 h-16 md:w-10 md:h-10 text-[#000000]" /> },
  { name: "Slack", icon: <SiSlack className="w-16 h-16 md:w-10 md:h-10 text-[#4A154B]" /> },
  { name: "Google Docs", icon: <SiGoogledocs className="w-16 h-16 md:w-10 md:h-10 text-[#4285F4]" /> },
  { name: "Confluence", icon: <SiConfluence className="w-16 h-16 md:w-10 md:h-10 text-[#172B4D]" /> },
  { name: "GitHub", icon: <SiGithub className="w-16 h-16 md:w-10 md:h-10 text-[#181717]" /> },
  { name: "Linear", icon: <SiLinear className="w-16 h-16 md:w-10 md:h-10 text-[#5E6AD2]" /> },
  { name: "Vercel", icon: <SiVercel className="w-16 h-16 md:w-10 md:h-10 text-[#000000]" /> },
  { name: "Railway", icon: <SiRailway className="w-16 h-16 md:w-10 md:h-10 text-[#0B0D0E]" /> },
  { name: "AWS", icon: <FaAws className="w-16 h-16 md:w-10 md:h-10 text-[#FF9900]" /> },
];

export default function AnimationSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [currentAct, setCurrentAct] = useState(1);
  const prevActRef = useRef(1);
  const directionRef = useRef<'down' | 'up'>('down');

  useEffect(() => {
    let ctx = gsap.context(() => {
      const actBoundaries = [
        { act: 1, start: 0, end: 2 },
        { act: 2, start: 2, end: 4.5 },
        { act: 3, start: 4.5, end: 8 },
        { act: 4, start: 8, end: 10.5 },
        { act: 5, start: 10.5, end: 14 },
        { act: 6, start: 14, end: 15.5 },
        { act: 7, start: 15.5, end: 18.5 },
        { act: 8, start: 18.5, end: 20 },
        { act: 9, start: 20, end: 24 },
        { act: 10, start: 24, end: 25.5 },
        { act: 11, start: 25.5, end: 27.5 },
        { act: 12, start: 27.5, end: 29.5 },
        { act: 13, start: 29.5, end: Infinity },
      ];

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
          onUpdate: (self) => {
            const currentTime = tl.time();
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${self.progress * 100}%`;
            }
            const boundary = actBoundaries.find(b => currentTime >= b.start && currentTime < b.end);
            const newAct = boundary ? boundary.act : 13;
            if (newAct !== prevActRef.current) {
              directionRef.current = newAct > prevActRef.current ? 'down' : 'up';
              prevActRef.current = newAct;
            }
            setCurrentAct(newAct);
          }
        }
      });

      // --- INITIAL SETUP ---
      // Scene 1: Hero
      gsap.set('.act1-card', { x: -60, opacity: 0 });
      gsap.set('.act1-strikethrough', { scaleX: 0, transformOrigin: 'left center' });
      gsap.set('.particle', { opacity: 0, scale: 0 });
      gsap.set('.act2-vault', { scale: 0.4, opacity: 0 });
      gsap.set('.act3-dashboard', { scaleX: 0.3, scaleY: 0.3, opacity: 0, borderRadius: '24px' });
      gsap.set('.secret-row', { opacity: 0, x: -10 });
      gsap.set('.check-sync', { scale: 0 });
      gsap.set('.avatar-orbit', { opacity: 0 });
      gsap.set('.avatar-orbit-container', { opacity: 0 });
      gsap.set('.connect-line', { strokeDashoffset: 100, strokeDasharray: 100 });
      gsap.set('.act4-terminal', { opacity: 0 });
      gsap.set('.terminal-text', { width: 0 });

      // Scene 2: Core
      gsap.set('.file-node', { y: -200, opacity: 0, scale: 0.8 });
      gsap.set('.central-engine', { scale: 0.5, opacity: 0 });
      gsap.set('.output-node', { y: 200, opacity: 0, scale: 0.8 });
      gsap.set('.flow-line', { opacity: 0, scaleY: 0 });

      // Scene 3: Integrations
      const isMobile = window.innerWidth < 768;
      gsap.set('.tool-node', { 
        x: () => (Math.random() - 0.5) * 500, 
        y: () => (Math.random() - 0.5) * 400,
        scale: 0.6,
        opacity: 0
      });
      gsap.set('.integration-line', { opacity: 0 });

      // Scene 4: Pricing
      gsap.set('.pricing-card', { x: 0, y: 0, scale: 0.8, opacity: 0, rotation: 0 });
      gsap.set('.card-1', { zIndex: 30 }); // Starter
      gsap.set('.card-2', { zIndex: 20 }); // Team
      gsap.set('.card-3', { zIndex: 10 }); // Enterprise

      // Final CTA
      gsap.set('.final-cta-wrapper', { opacity: 0, scale: 0.9, y: 50 });

      // Ambient breathing loop
      gsap.to('.act1-card', { rotation: 1, yoyo: true, repeat: -1, duration: 2, ease: 'sine.inOut', stagger: 0.2 });

      // Act 1: The old way
      tl.to('.act1-card', { x: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power2.out' }, 0);
      tl.to('.act1-strikethrough', { scaleX: 1, duration: 1.5, ease: 'power2.inOut' }, 0.5);

      // Act 2: Transition to vault
      tl.to('.act1-card', { scale: 0.6, filter: 'blur(8px)', opacity: 0, duration: 1, ease: 'power2.inOut' }, 2);
      tl.to('.act1-strikethrough', { scale: 0.6, filter: 'blur(8px)', opacity: 0, duration: 1, ease: 'power2.inOut' }, 2);
      tl.to('.particle', { opacity: 1, scale: 1, duration: 0.2, stagger: 0.02 }, 2.5);
      tl.to('.particle', { x: 0, y: 0, opacity: 0, duration: 1, stagger: 0.02, ease: 'power3.in' }, 2.7);
      tl.to('.act2-vault', { scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.5)' }, 3.2);

      // Act 3: Dashboard
      tl.to('.act2-vault', { opacity: 0, duration: 0.2 }, 4.5);
      tl.to('.act3-dashboard', { opacity: 1, scaleX: 1, scaleY: 1, duration: 1.2, ease: 'elastic.out(1, 0.75)' }, 4.5);
      tl.to('.secret-row', { opacity: 1, x: 0, duration: 0.5, stagger: 0.2 }, 5.2);
      tl.to('.check-sync', { scale: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(2)' }, 5.8);
      tl.to(['.avatar-orbit', '.avatar-orbit-container'], { opacity: 1, duration: 0.5 }, 6);

      // Act 4: Terminal
      tl.to('.act3-dashboard', { scale: 1.04, y: -12, duration: 1, ease: 'power2.out' }, 7.5);
      tl.to('.act4-terminal', { opacity: 1, duration: 0.2 }, 8);
      tl.to('.terminal-text', { width: '100%', duration: 1, ease: 'steps(30)' }, 8.1);
      tl.to('.act4-terminal-success', { opacity: 1, duration: 0.1 }, 9.2);

      // Transition to Core
      tl.to(['.act3-dashboard', '.act4-terminal', '.avatar-orbit-container'], { opacity: 0, scale: 0.8, filter: 'blur(10px)', duration: 1 }, 10.5);

      // Act 5: Core - Inputs
      tl.to('.file-node', { y: -100, opacity: 1, scale: 1, duration: 1, stagger: 0.2, ease: 'back.out(1.2)' }, 11.5);
      tl.to('.central-engine', { scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.5)' }, 12);
      tl.to('.flow-line.in', { opacity: 0.5, scaleY: 1, duration: 1, transformOrigin: 'top center' }, 12.5);

      // Act 6: Core - Processing
      tl.to('.central-engine', { rotation: 180, boxShadow: '0 0 60px rgba(29,29,31,0.4)', duration: 1.5, ease: 'power2.inOut' }, 14);

      // Act 7: Core - Output
      tl.to('.flow-line.out', { opacity: 0.5, scaleY: 1, duration: 1, transformOrigin: 'top center' }, 15.5);
      tl.to('.output-node', { y: 100, opacity: 1, scale: 1, duration: 1, stagger: 0.2, ease: 'back.out(1.2)' }, 16);

      // Transition to Integrations
      tl.to(['.file-node', '.output-node', '.flow-line'], { opacity: 0, scale: 0.5, duration: 1 }, 17.5);
      tl.to('.central-engine', { scale: 0.8, boxShadow: '0 0 0px rgba(0,0,0,0)', duration: 1 }, 17.5);

      // Act 8: Integrations - Scattered
      tl.to('.tool-node', { opacity: 1, scale: 1, duration: 1, stagger: 0.1, ease: 'back.out(1.5)' }, 18.5);

      // Act 9: Integrations - Snap
      tools.forEach((_, i) => {
        const angle = (i / tools.length) * Math.PI * 2;
        const radius = 240;
        tl.to(`.tool-${i}`, { 
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          duration: 1.5,
          ease: 'power3.inOut'
        }, 20);
      });
      tl.to('.integration-line', { opacity: isMobile ? 0.4 : 0.2, duration: 1 }, 21);

      // Transition to Pricing
      tl.to(['.tool-node', '.integration-line', '.central-engine'], { opacity: 0, scale: 0, duration: 1, ease: 'power2.in' }, 22.5);

      // Act 10: Pricing - Starter
      if (isMobile) {
        tl.to('.card-1', { scale: 1, opacity: 1, duration: 1, ease: 'power3.out' }, 24);
        tl.to('.card-2', { scale: 0.85, opacity: 0.5, y: 200, duration: 1, ease: 'power3.out' }, 24);
        tl.to('.card-3', { scale: 0.7, opacity: 0.2, y: 400, duration: 1, ease: 'power3.out' }, 24);
      } else {
        tl.to('.card-1', { scale: 1, opacity: 1, duration: 1, ease: 'power3.out' }, 24);
        tl.to('.card-2', { scale: 0.95, opacity: 0.5, y: 20, duration: 1, ease: 'power3.out' }, 24);
        tl.to('.card-3', { scale: 0.9, opacity: 0.2, y: 40, duration: 1, ease: 'power3.out' }, 24);
      }

      // Act 11: Pricing - Team
      if (isMobile) {
        tl.to('.card-1', { y: -220, scale: 0.85, opacity: 0.7, duration: 1.5, ease: 'power3.inOut' }, 25.5);
        tl.to('.card-2', { y: 0, scale: 1.1, opacity: 1, zIndex: 40, duration: 1.5, ease: 'power3.inOut' }, 25.5);
      } else {
        tl.to('.card-1', { x: -300, rotation: -5, duration: 1.5, ease: 'power3.inOut' }, 25.5);
        tl.to('.card-2', { x: 0, y: 0, scale: 1.1, opacity: 1, zIndex: 40, duration: 1.5, ease: 'power3.inOut' }, 25.5);
      }

      // Act 12: Pricing - Enterprise
      if (isMobile) {
        tl.to('.card-1', { y: -440, opacity: 0.5, scale: 0.7, duration: 1.5, ease: 'power3.inOut' }, 27.5);
        tl.to('.card-2', { y: 0, scale: 1, opacity: 1, duration: 1.5, ease: 'power3.inOut' }, 27.5);
        tl.to('.card-3', { y: 0, scale: 1.05, opacity: 1, zIndex: 50, duration: 1.5, ease: 'power3.inOut' }, 27.5);
      } else {
        tl.to('.card-1', { x: -350, opacity: 0.5, scale: 0.9, duration: 1.5, ease: 'power3.inOut' }, 27.5);
        tl.to('.card-2', { x: 0, scale: 1, opacity: 1, duration: 1.5, ease: 'power3.inOut' }, 27.5);
        tl.to('.card-3', { x: 350, y: 0, scale: 1.05, opacity: 1, rotation: 5, zIndex: 50, duration: 1.5, ease: 'power3.inOut' }, 27.5);
      }

      // Act 13: Final Outro
      tl.to(['.card-1', '.card-2', '.card-3'], { y: -100, opacity: 0, duration: 1 }, 29.5);
      tl.to('.final-cta-wrapper', { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'elastic.out(1, 0.8)' }, 30.5);

      // Continuous Orbits
      gsap.to('.avatar-orbit-container', { rotation: 360, repeat: -1, duration: 20, ease: 'none' });
      gsap.to('.avatar-orbit', { rotation: -360, repeat: -1, duration: 20, ease: 'none' });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const getActText = () => {
    switch(currentAct) {
      case 1: return <><div className="text-[#FF3B30] text-xs uppercase font-bold tracking-widest mb-2">The old way</div><h2 className="text-3xl md:text-[48px] leading-[1.1] font-medium text-[#1D1D1F] tracking-tight">Secrets passed<br/>in messages.</h2></>;
      case 2: return <h2 className="text-3xl md:text-[48px] leading-[1.1] font-medium text-[#1D1D1F] tracking-tight">One place.</h2>;
      case 3: return <><h2 className="text-3xl md:text-[48px] leading-[1.1] font-medium text-[#1D1D1F] tracking-tight mb-4">Every secret.<br/>Synced instantly.</h2><p className="text-sm md:text-[16px] text-[#6E6E73] leading-relaxed">No more .env files passed<br/>in Slack.</p></>;
      case 4: return <><h2 className="text-3xl md:text-[48px] leading-[1.1] font-medium text-[#1D1D1F] tracking-tight mb-4">CLI Integrated.</h2><p className="text-sm md:text-[16px] text-[#6E6E73] leading-relaxed">Pull secrets effortlessly.</p></>;
      case 5: return <><h2 className="text-3xl md:text-[48px] leading-[1.1] font-medium text-[#1D1D1F] tracking-tight mb-4">Connect company<br/>knowledge.</h2><p className="text-sm md:text-[16px] text-[#6E6E73] leading-relaxed">Upload configs and secrets.</p></>;
      case 6: return <><h2 className="text-3xl md:text-[48px] leading-[1.1] font-medium text-[#1D1D1F] tracking-tight mb-4">Build the<br/>secrets model.</h2><p className="text-sm md:text-[16px] text-[#6E6E73] leading-relaxed">Curo organizes everything.</p></>;
      case 7: return <><h2 className="text-3xl md:text-[48px] leading-[1.1] font-medium text-[#1D1D1F] tracking-tight mb-4">Generate consistent<br/>output.</h2><p className="text-sm md:text-[16px] text-[#6E6E73] leading-relaxed">For every environment.</p></>;
      case 8: return <><h2 className="text-3xl md:text-[48px] leading-[1.1] font-medium text-[#1D1D1F] tracking-tight mb-4">Works with<br/>your tools.</h2></>;
      case 9: return <><h2 className="text-3xl md:text-[48px] leading-[1.1] font-medium text-[#1D1D1F] tracking-tight mb-4">Everything<br/>connected.</h2><p className="text-sm md:text-[16px] text-[#6E6E73] leading-relaxed">No migration required.</p></>;
      case 10: return <><h2 className="text-3xl md:text-[48px] leading-[1.1] font-medium text-[#1D1D1F] tracking-tight mb-4">Start simple.</h2><p className="text-sm md:text-[16px] text-[#6E6E73] leading-relaxed">Free for small teams.</p></>;
      case 11: return <><h2 className="text-3xl md:text-[48px] leading-[1.1] font-medium text-[#1D1D1F] tracking-tight mb-4">Scale gracefully.</h2><p className="text-sm md:text-[16px] text-[#6E6E73] leading-relaxed">For growing startups.</p></>;
      case 12: return <><h2 className="text-3xl md:text-[48px] leading-[1.1] font-medium text-[#1D1D1F] tracking-tight mb-4">Enterprise ready.</h2><p className="text-sm md:text-[16px] text-[#6E6E73] leading-relaxed">Unlimited everything.</p></>;
      case 13: return null;
      default: return null;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: '1400vh', background: '#fcfcfc' }}>
      <div className="sticky top-0 w-full h-screen overflow-hidden font-sans">
        <div className="absolute top-0 left-0 h-[2px] bg-[#1D1D1F] z-50 transition-all duration-100 ease-out" ref={progressBarRef} style={{ width: '0%' }}></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full h-full relative flex items-center justify-center">
          
          {/* Dynamic Texts */}
          <div className={`absolute top-12 md:top-20 left-6 md:left-20 z-40 max-w-md pointer-events-none transition-all duration-500`}>
            <AnimatePresence mode="popLayout">
              <motion.div key={currentAct}
                initial={{ opacity: 0, y: directionRef.current === 'down' ? 20 : -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: directionRef.current === 'down' ? -20 : 20 }}
                transition={{ duration: 0.35 }}>
                {getActText()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Global Stage */}
          <div className="relative w-full max-w-[1200px] h-[700px] flex items-center justify-center z-10 pointer-events-none scale-[0.6] sm:scale-[0.8] md:scale-[0.9] lg:scale-100 origin-center">
          
          {/* --- SCENE 1: HERO --- */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Act 1 Cards */}
            <div className="absolute flex gap-6 z-10">
              <div className="act1-strikethrough absolute top-1/2 left-[-10%] w-[120%] h-1 bg-[#FF3B30] z-20"></div>
              <div className="act1-card bg-[#F5F5F7] p-3 md:p-4 rounded-[16px] w-[180px] md:w-[200px] shadow-[0_2px_20px_rgba(0,0,0,0.06)] border border-white/50 relative">
                <div className="flex items-center gap-2 mb-3 text-[#1D1D1F] font-medium text-xs md:text-sm"><span className="text-xl md:text-xl">💬</span> Slack DM</div>
                <div className="text-xs md:text-xs text-[#6E6E73] font-mono leading-relaxed">
                  hey here's the<br/>stripe key:<br/>
                  <span className="text-[#1D1D1F] bg-gray-200 px-1 rounded">sk-live-...</span>
                </div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#FF3B30] rounded-full animate-ping opacity-75"></div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#FF3B30] rounded-full border-2 border-white"></div>
              </div>
              <div className="act1-card bg-[#F5F5F7] p-3 md:p-4 rounded-[16px] w-[180px] md:w-[200px] shadow-[0_2px_20px_rgba(0,0,0,0.06)] border border-white/50 relative mt-8">
                <div className="flex items-center gap-2 mb-3 text-[#1D1D1F] font-medium text-xs md:text-sm"><span className="text-xl md:text-xl">📧</span> Email</div>
                <div className="text-xs md:text-xs text-[#6E6E73] font-mono leading-relaxed">
                  <span className="text-[#1D1D1F]">API_KEY=sk-...</span><br/>
                  <span className="italic">(attached)</span>
                </div>
              </div>
              <div className="act1-card bg-[#F5F5F7] p-3 md:p-4 rounded-[16px] w-[180px] md:w-[200px] shadow-[0_2px_20px_rgba(0,0,0,0.06)] border border-white/50 relative mt-[-20px]">
                <div className="flex items-center gap-2 mb-3 text-[#1D1D1F] font-medium text-xs md:text-sm"><span className="text-xl md:text-xl">📄</span> .env file</div>
                <div className="text-xs md:text-xs text-[#6E6E73] font-mono leading-relaxed">
                  <span className="text-[#1D1D1F]">DB_PASS=hunter2</span><br/>
                  <span className="italic">(committed 😬)</span>
                </div>
              </div>
            </div>

            {/* Act 2 Particles & Vault */}
            {Array.from({ length: 25 }).map((_, i) => {
              const angle = (i / 25) * Math.PI * 2;
              const r = 200 + Math.random() * 100;
              const startX = Math.cos(angle) * r;
              const startY = Math.sin(angle) * r;
              return <div key={i} className="particle absolute w-1.5 h-1.5 bg-[#1D1D1F] rounded-full" style={{ transform: `translate(${startX}px, ${startY}px)` }}></div>;
            })}
            <div className="act2-vault absolute bg-[#F5F5F7] w-[140px] h-[140px] md:w-[120px] md:h-[120px] rounded-[32px] flex items-center justify-center shadow-[0_0_40px_rgba(29,29,31,0.2)] border border-white z-20">
              <svg className="w-14 h-14 md:w-12 md:h-12 text-[#1D1D1F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            {/* Act 3 Dashboard & Orbits */}
            <div className="absolute w-[420px] h-[420px] md:w-[600px] md:h-[600px] flex items-center justify-center z-10">
              <div className="avatar-orbit-container absolute w-full h-full rounded-full border border-dashed border-[#E5E5EA]">
                <div className="avatar-orbit absolute top-0 left-1/2 -ml-8 -mt-8 md:-ml-6 md:-mt-6 w-16 h-16 md:w-12 md:h-12 rounded-full bg-[#F5F5F7] border-2 border-white shadow-sm flex items-center justify-center text-sm md:text-xs font-medium text-[#1D1D1F]">AK</div>
                <div className="avatar-orbit absolute bottom-1/4 -right-2 w-16 h-16 md:w-12 md:h-12 rounded-full bg-[#F5F5F7] border-2 border-white shadow-sm flex items-center justify-center text-sm md:text-xs font-medium text-[#1D1D1F]">SM</div>
                <div className="avatar-orbit absolute bottom-1/4 -left-2 w-16 h-16 md:w-12 md:h-12 rounded-full bg-[#F5F5F7] border-2 border-white shadow-sm flex items-center justify-center text-sm md:text-xs font-medium text-[#1D1D1F]">JR</div>
              </div>
            </div>
            <div className="act3-dashboard absolute bg-white w-[360px] md:w-[480px] rounded-[16px] shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-[#E5E5EA] overflow-hidden z-30">
              <div className="bg-[#F5F5F7] px-4 md:px-6 py-4 border-b border-[#E5E5EA] flex justify-between items-center">
                <div className="flex items-center gap-2 font-medium text-sm md:text-base text-[#1D1D1F]">Production Secrets</div>
              </div>
              <div className="p-4 md:p-6 space-y-3 md:space-y-4 font-mono text-xs md:text-sm">
                {['STRIPE_SECRET_KEY', 'DATABASE_URL', 'OPENAI_API_KEY', 'JWT_SECRET'].map((key, i) => (
                  <div key={i} className="secret-row flex justify-between items-center">
                    <span className="text-[10px] md:text-xs text-[#6E6E73] w-1/3 truncate">{key}</span>
                    <div className="secret-value relative flex-1 mx-2 md:mx-4 h-5 md:h-6 rounded bg-[#F5F5F7] overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#E5E5EA] via-[#F5F5F7] to-[#E5E5EA] w-[200%] animate-[shimmer_2s_linear_infinite]"></div>
                      <span className="absolute inset-0 flex items-center px-2 tracking-[0.2em] text-[#1D1D1F]">••••••••</span>
                    </div>
                    <div className="check-sync flex items-center gap-1 text-[#30D158] text-xs font-sans font-medium">✓ sync</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Act 4 Terminal */}
            <div className="act4-terminal absolute -bottom-16 w-[320px] md:w-[480px] z-30 font-mono text-xs md:text-sm">
              <div className="text-[#1D1D1F] flex relative overflow-hidden h-6 whitespace-nowrap terminal-text border-r-2 border-[#1D1D1F] animate-[blink_1s_step-end_infinite]">
                $ envsync pull --env production
              </div>
              <div className="act4-terminal-success text-[#30D158] mt-2 opacity-0">✓ 12 secrets synced in 0.3s</div>
            </div>
          </div>

          {/* --- SCENE 2: CORE --- */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Engine (also used in Integrations) */}
            <div className="central-engine absolute top-1/2 left-1/2 -mt-20 -ml-20 md:-mt-16 md:-ml-16 w-40 h-40 md:w-32 md:h-32 bg-[#1D1D1F] rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] flex items-center justify-center z-20">
              <PiFlask className="w-16 h-16 md:w-14 md:h-14 text-white" />
              <div className="flow-line out absolute top-full left-1/2 w-0.5 h-32 bg-[#30D158] -ml-[1px]"></div>
            </div>
            {/* Inputs */}
            <div className="flex gap-10 md:gap-16 absolute top-6 md:top-10">
              <div className="file-node w-24 h-32 md:w-24 md:h-32 bg-white rounded-xl border border-[#E5E5EA] shadow-sm flex flex-col items-center justify-center relative">
                <span className="text-2xl md:text-2xl mb-2">📄</span>
                <span className="text-xs md:text-xs font-mono text-[#6E6E73]">.env.local</span>
                <div className="flow-line in absolute top-full left-1/2 w-0.5 h-[100px] bg-[#1D1D1F] -ml-[1px]"></div>
              </div>
              <div className="file-node w-24 h-32 md:w-24 md:h-32 bg-white rounded-xl border border-[#E5E5EA] shadow-sm flex flex-col items-center justify-center relative">
                <span className="text-2xl md:text-2xl mb-2">⚙️</span>
                <span className="text-xs md:text-xs font-mono text-[#6E6E73]">config.yml</span>
                <div className="flow-line in absolute top-full left-1/2 w-0.5 h-[100px] bg-[#1D1D1F] -ml-[1px]"></div>
              </div>
            </div>
            {/* Outputs */}
              <div className="flex gap-4 md:gap-8 absolute bottom-6 md:bottom-10">
              {['Development', 'Staging', 'Production'].map((env, i) => (
                <div key={i} className="output-node w-28 h-20 md:w-32 md:h-20 bg-[#F5F5F7] rounded-xl border border-[#E5E5EA] flex items-center justify-center text-[#1D1D1F] font-medium text-xs md:text-sm">
                  {env}
                </div>
              ))}
            </div>
          </div>

          {/* --- SCENE 3: INTEGRATIONS --- */}
          <div className="absolute inset-0 flex items-center justify-center">
            {tools.map((tool, i) => (
              <div key={i} className={`tool-node tool-${i} absolute w-[100px] h-[100px] md:w-[72px] md:h-[72px] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center justify-center text-[#1D1D1F] font-bold text-2xl md:text-lg border border-[#E5E5EA] z-30`}>
                {tool.icon}
              </div>
            ))}
            <svg className="integration-line absolute z-10" style={{ left: '50%', top: '50%', width: '1200px', height: '700px', transform: 'translate(-50%, -50%)' }} viewBox="0 0 1200 700">
              {tools.map((_, i) => {
                const angle = (i / tools.length) * Math.PI * 2;
                const r = 240;
                return <line key={i} x1="600" y1="350" x2={600 + Math.cos(angle) * r} y2={350 + Math.sin(angle) * r} stroke="#1D1D1F" strokeWidth="2" strokeDasharray="6 6" />;
              })}
            </svg>
          </div>

          {/* --- SCENE 4: PRICING --- */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="pricing-card card-1 absolute w-[420px] md:w-[300px] bg-white rounded-3xl border border-[#E5E5EA] shadow-xl p-8 md:p-8 pointer-events-auto">
              <h3 className="text-3xl md:text-xl font-semibold text-[#1D1D1F] mb-3">Starter</h3>
              <div className="text-5xl md:text-4xl font-bold text-[#1D1D1F] mb-6">$29<span className="text-base md:text-sm font-normal text-[#6E6E73]">/mo</span></div>
              <ul className="space-y-3 md:space-y-3 mb-8 text-base md:text-sm text-[#6E6E73]">
                <li>✓ Up to 5 team members</li>
                <li>✓ 50,000 secrets</li>
                <li>✓ Basic vault setup</li>
              </ul>
              <Button variant="outline" size="md" className="w-full bg-[#F5F5F7] border-0 text-[#1D1D1F] hover:bg-[#E5E5EA] rounded-[5px]">Start Free Trial</Button>
            </div>
            <div className="pricing-card card-2 absolute w-[420px] md:w-[300px] bg-white rounded-3xl border-2 border-[#1D1D1F] shadow-2xl p-8 md:p-8 pointer-events-auto">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1D1D1F] text-white text-xs md:text-xs font-bold px-3 py-1 rounded-full">Popular</div>
              <h3 className="text-3xl md:text-xl font-semibold text-[#1D1D1F] mb-3">Team</h3>
              <div className="text-5xl md:text-4xl font-bold text-[#1D1D1F] mb-6">$159<span className="text-base md:text-sm font-normal text-[#6E6E73]">/mo</span></div>
              <ul className="space-y-3 md:space-y-3 mb-8 text-base md:text-sm text-[#6E6E73]">
                <li>✓ Up to 25 team members</li>
                <li>✓ Advanced access controls</li>
                <li>✓ Version history & rollbacks</li>
              </ul>
              <Button variant="secondary" size="md" className="w-full py-4 shadow-md rounded-[5px]">Upgrade to Team</Button>
            </div>
            <div className="pricing-card card-3 absolute w-[420px] md:w-[300px] bg-[#F5F5F7] rounded-3xl border border-[#E5E5EA] shadow-2xl p-8 md:p-8 pointer-events-auto">
              <h3 className="text-3xl md:text-xl font-semibold mb-3">Enterprise</h3>
              <div className="text-5xl md:text-4xl font-bold mb-6">Custom</div>
              <ul className="space-y-3 md:space-y-3 mb-8 text-base md:text-sm text-[#6E6E73]">
                <li>✓ Unlimited everything</li>
                <li>✓ Dedicated manager</li>
                <li>✓ Custom SLA guarantees</li>
              </ul>
              <Button variant="outline" size="md" className="w-full py-4 text-[#1D1D1F] border-[#E5E5EA] hover:bg-[#fcfcfc] rounded-[5px]">Contact Sales</Button>
            </div>
          </div>

          {/* FINAL CTA */}
          <div className="final-cta-wrapper absolute inset-0 flex flex-col items-center justify-center pointer-events-auto">
            <h2 className="text-4xl md:text-[64px] leading-[1.1] font-medium text-[#1D1D1F] tracking-tight text-center mb-8">
              Ready to centralize?
            </h2>
            <Button variant="secondary" size="md" className="px-8 py-4 text-lg shadow-lg rounded-[5px]">
              Get Started for Free
            </Button>
          </div>

        </div>
        </div>
      </div>
      <style>{`
        @keyframes shimmer { 0% { transform: translateX(-50%); } 100% { transform: translateX(0%); } }
        @keyframes blink { 0%, 100% { border-color: transparent; } 50% { border-color: #1D1D1F; } }
      `}</style>
    </div>
  );
}
