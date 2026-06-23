import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { SiGithub, SiVercel, SiRailway } from 'react-icons/si';
import { FaAws } from 'react-icons/fa';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { RiShieldKeyholeLine } from 'react-icons/ri';
import { Button } from '../ui/Button';

gsap.registerPlugin(ScrollTrigger);

export default function AnimationSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [currentAct, setCurrentAct] = useState(1);
  const prevActRef = useRef(1);
  const directionRef = useRef<'down' | 'up'>('down');

  useEffect(() => {
    let ctx = gsap.context(() => {
      const actBoundaries = [
        { act: 1, start: 0, end: 4.5 },
        { act: 3, start: 4.5, end: 7 },
        { act: 4, start: 7, end: 9.5 },
        { act: 5, start: 9.5, end: 14 },
        { act: 7, start: 14, end: 19 },
        { act: 10, start: 19, end: Infinity },
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
            const newAct = boundary ? boundary.act : 10;
            if (newAct !== prevActRef.current) {
              directionRef.current = newAct > prevActRef.current ? 'down' : 'up';
              prevActRef.current = newAct;
            }
            setCurrentAct(newAct);
          }
        }
      });

      gsap.set('.secret-source', { x: -80, opacity: 0 });
      gsap.set('.warning-dot', { scale: 0, opacity: 0 });
      gsap.set('.vault-shield', { scale: 0.5, opacity: 0 });
      gsap.set('.vault-text', { opacity: 0, y: 30 });
      gsap.set('.manage-dashboard', { scaleX: 0.3, scaleY: 0.3, opacity: 0, borderRadius: '24px' });
      gsap.set('.secret-manage-row', { opacity: 0, x: -10 });
      gsap.set('.env-badge', { scale: 0 });
      gsap.set('.env-selector', { opacity: 0, y: -10 });
      gsap.set('.sync-terminal', { opacity: 0, y: 20 });
      gsap.set('.cli-line', { width: 0 });
      gsap.set('.cli-success', { opacity: 0 });
      gsap.set('.pipeline-node', { opacity: 0, scale: 0.8 });
      gsap.set('.pipeline-arrow', { scaleX: 0, transformOrigin: 'left center' });
      gsap.set('.env-flow-badge', { opacity: 0, y: 20 });
      gsap.set('.final-cta-wrapper', { opacity: 0, scale: 0.9, y: 50 });

      tl.to('.secret-source', { x: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power2.out' }, 0);
      tl.to('.warning-dot', { scale: 1, opacity: 1, duration: 0.3, stagger: 0.15, ease: 'power2.out' }, 0.5);
      tl.to('.secret-source', { opacity: 0, scale: 0.6, filter: 'blur(8px)', duration: 1, ease: 'power2.inOut' }, 2);
      tl.to('.warning-dot', { opacity: 0, duration: 0.5 }, 2);

      tl.to('.vault-shield', { scale: 1, opacity: 1, duration: 1.2, ease: 'expo.out' }, 3);
      tl.to('.vault-text', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 3.5);
      tl.to('.vault-shield', { scale: 0.6, opacity: 0, duration: 0.8, ease: 'power2.in' }, 4.5);
      tl.to('.vault-text', { opacity: 0, duration: 0.5 }, 4.5);

      tl.to('.manage-dashboard', { opacity: 1, scaleX: 1, scaleY: 1, duration: 1.2, ease: 'expo.out' }, 5.5);
      tl.to('.env-selector', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 5.8);
      tl.to('.secret-manage-row', { opacity: 1, x: 0, duration: 0.5, stagger: 0.15, ease: 'power2.out' }, 6.2);
      tl.to('.env-badge', { scale: 1, duration: 0.3, stagger: 0.1, ease: 'power3.out' }, 6.8);
      tl.to(['.manage-dashboard', '.env-selector'], { opacity: 0, scale: 0.8, filter: 'blur(10px)', duration: 1 }, 8);

      tl.to('.sync-terminal', { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, 9);
      tl.to('.cli-line', { width: '100%', duration: 1.2, ease: 'power3.out' }, 9.3);
      tl.to('.cli-success', { opacity: 1, duration: 0.3, stagger: 0.3, ease: 'power2.out' }, 10.5);
      tl.to(['.sync-terminal', '.cli-success'], { opacity: 0, scale: 0.8, filter: 'blur(8px)', duration: 1 }, 12);

      tl.to('.pipeline-node', { opacity: 1, scale: 1, duration: 0.8, stagger: 0.2, ease: 'power2.out' }, 13.5);
      tl.to('.pipeline-arrow', { scaleX: 1, duration: 0.6, stagger: 0.2, ease: 'power3.out' }, 14);
      tl.to('.env-flow-badge', { opacity: 1, y: 0, duration: 0.5, stagger: 0.15, ease: 'power2.out' }, 14.5);
      tl.to(['.pipeline-node', '.pipeline-arrow', '.env-flow-badge'], { opacity: 0, y: -30, duration: 1 }, 16);

      tl.to('.final-cta-wrapper', { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'expo.out' }, 19);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const getActText = () => {
    switch(currentAct) {
      case 1: return <><div className="text-[#FF3B30] text-xs uppercase font-bold tracking-widest mb-2">Secrets everywhere</div><h2 className="text-3xl md:text-[48px] leading-[1.1] font-medium text-[#1D1D1F] tracking-tight">Secrets are<br/>everywhere.</h2></>;
      case 3: return <><div className="text-[#1D1D1F] text-xs uppercase font-bold tracking-widest mb-2">Centralize</div><h2 className="text-3xl md:text-[48px] leading-[1.1] font-medium text-[#1D1D1F] tracking-tight">One source<br/>of truth.</h2></>;
      case 4: return <h2 className="text-3xl md:text-[48px] leading-[1.1] font-medium text-[#1D1D1F] tracking-tight">Centralized.</h2>;
      case 5: return <><div className="text-[#1D1D1F] text-xs uppercase font-bold tracking-widest mb-2">Manage</div><h2 className="text-3xl md:text-[48px] leading-[1.1] font-medium text-[#1D1D1F] tracking-tight">Manage every<br/>environment.</h2></>;
      case 7: return <><div className="text-[#1D1D1F] text-xs uppercase font-bold tracking-widest mb-2">Sync</div><h2 className="text-3xl md:text-[48px] leading-[1.1] font-medium text-[#1D1D1F] tracking-tight">Developer<br/>workflow first.</h2></>;
      default: return null;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: '1000vh', background: '#fcfcfc' }}>
      <div id="secrets" className="absolute top-0 left-0 w-px h-px scroll-mt-24" />
      <div id="centralize" className="absolute top-[20%] left-0 w-px h-px scroll-mt-24" />
      <div id="manage" className="absolute top-[40%] left-0 w-px h-px scroll-mt-24" />
      <div id="sync" className="absolute top-[60%] left-0 w-px h-px scroll-mt-24" />
      <div id="deploy" className="absolute top-[80%] left-0 w-px h-px scroll-mt-24" />

      <div className="sticky top-0 w-full h-screen overflow-hidden font-sans">
        <div className="absolute top-0 left-0 h-[2px] bg-[#1D1D1F] z-50 transition-all duration-100 ease-out" ref={progressBarRef} style={{ width: '0%' }}></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full h-full relative flex items-center justify-center">

          <div className="absolute top-12 md:top-20 left-6 md:left-20 z-40 max-w-md pointer-events-none">
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

          <div className="relative w-full max-w-[1200px] h-[700px] flex items-center justify-center z-10 pointer-events-none transform-gpu scale-[0.6] sm:scale-[0.8] md:scale-[0.9] lg:scale-100 origin-center">

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute flex gap-6 z-10 flex-wrap justify-center">
              <div className="secret-source bg-[#F5F5F7] p-4 rounded-[16px] w-[200px] shadow-[0_2px_20px_rgba(0,0,0,0.06)] border border-white/50 relative">
                <div className="flex items-center gap-2 mb-3 text-[#1D1D1F] font-medium text-sm"><HiOutlineDocumentText className="w-4 h-4" /> .env.local</div>
                <div className="text-xs text-[#6E6E73] font-mono leading-relaxed">
                  DATABASE_URL=<span className="text-[#1D1D1F]">postgres://...</span>
                </div>
                <div className="warning-dot absolute -top-1 -right-1 w-3 h-3 bg-[#FF3B30] rounded-full"></div>
              </div>
              <div className="secret-source bg-[#F5F5F7] p-4 rounded-[16px] w-[200px] shadow-[0_2px_20px_rgba(0,0,0,0.06)] border border-white/50 relative mt-8">
                <div className="flex items-center gap-2 mb-3 text-[#1D1D1F] font-medium text-sm"><SiGithub className="w-4 h-4" /> GitHub Secrets</div>
                <div className="text-xs text-[#6E6E73] font-mono leading-relaxed">
                  18 variables, no audit trail
                </div>
                <div className="warning-dot absolute -top-1 -right-1 w-3 h-3 bg-[#FF3B30] rounded-full"></div>
              </div>
              <div className="secret-source bg-[#F5F5F7] p-4 rounded-[16px] w-[200px] shadow-[0_2px_20px_rgba(0,0,0,0.06)] border border-white/50 relative mt-[-20px]">
                <div className="flex items-center gap-2 mb-3 text-[#1D1D1F] font-medium text-sm"><FaAws className="w-4 h-4" /> AWS Secrets</div>
                <div className="text-xs text-[#6E6E73] font-mono leading-relaxed">
                  Scattered across 3 regions
                </div>
                <div className="warning-dot absolute -top-1 -right-1 w-3 h-3 bg-[#FF3B30] rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="vault-shield w-24 h-24 md:w-20 md:h-20 bg-[#1D1D1F] rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] flex items-center justify-center z-20">
              <RiShieldKeyholeLine className="w-12 h-12 md:w-10 md:h-10 text-white" />
            </div>
            <div className="vault-text mt-6 text-center">
              <h3 className="text-2xl md:text-3xl font-medium text-[#1D1D1F] tracking-tight">CURO</h3>
              <p className="text-sm text-[#6E6E73] mt-2">Secure Environment Variable Management</p>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="manage-dashboard absolute bg-white w-[420px] md:w-[520px] rounded-[16px] shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-[#E5E5EA] overflow-hidden z-30">
              <div className="bg-[#F5F5F7] px-6 py-4 border-b border-[#E5E5EA] flex justify-between items-center">
                <div className="flex items-center gap-2 font-medium text-sm text-[#1D1D1F]">Secrets</div>
                <div className="env-selector flex gap-1">
                  {['Development', 'Staging', 'Production'].map((env, i) => (
                    <span key={i} className={`px-3 py-1 rounded-full text-xs font-medium ${i === 1 ? 'bg-[#1D1D1F] text-white' : 'bg-white text-[#6E6E73] border border-[#E5E5EA]'}`}>{env}</span>
                  ))}
                </div>
              </div>
              <div className="p-6 space-y-4 font-mono text-sm">
                {[['DATABASE_URL', 'postgres://prod-db.curo.internal:5432'], ['OPENAI_API_KEY', 'sk-proj-••••••••••••'], ['JWT_SECRET', '••••••••••••••••']].map(([key, value], i) => (
                  <div key={i} className="secret-manage-row flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-xs text-[#1D1D1F] font-medium">{key}</span>
                      <span className="text-[10px] text-[#6E6E73] mt-0.5">{value}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="env-badge px-2 py-0.5 bg-[#F5F5F7] rounded text-[10px] text-[#6E6E73] font-sans font-medium">production</span>
                      <span className="env-badge px-2 py-0.5 bg-[#F5F5F7] rounded text-[10px] text-[#6E6E73] font-sans font-medium">v23</span>
                      <span className="env-badge px-2 py-0.5 bg-[#F5F5F7] rounded text-[10px] text-[#6E6E73] font-sans font-medium">encrypted</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="sync-terminal bg-[#1D1D1F] w-[400px] md:w-[480px] rounded-[12px] shadow-[0_20px_40px_rgba(0,0,0,0.2)] overflow-hidden z-30">
              <div className="flex items-center gap-1.5 px-4 py-3 bg-[#2C2C2E]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]"></div>
                <span className="text-[#8E8E93] text-xs ml-2 font-sans">terminal</span>
              </div>
              <div className="p-5 font-mono text-sm">
                <div className="text-[#64D2FF] mb-2">$ curo pull --env production</div>
                <div className="cli-line text-[#E5E5EA] overflow-hidden whitespace-nowrap border-r-2 border-[#64D2FF]">⠋ Fetching secrets...</div>
                <div className="cli-success text-[#30D158] mt-2">✓ 24 secrets synced</div>
                <div className="cli-success text-[#30D158]">✓ .env generated</div>
                <div className="cli-success text-[#30D158]">✓ Application ready</div>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-6 md:gap-8 z-30">
              <div className="pipeline-node flex flex-col items-center">
                <SiGithub className="w-10 h-10 md:w-8 md:h-8 text-[#1D1D1F]" />
                <span className="text-xs text-[#6E6E73] mt-2 font-sans">GitHub</span>
              </div>
              <div className="pipeline-arrow text-[#1D1D1F] text-2xl">→</div>
              <div className="pipeline-node flex flex-col items-center">
                <div className="w-12 h-12 md:w-10 md:h-10 bg-[#1D1D1F] rounded-xl flex items-center justify-center">
                  <RiShieldKeyholeLine className="w-6 h-6 md:w-5 md:h-5 text-white" />
                </div>
                <span className="text-xs text-[#1D1D1F] mt-2 font-sans font-medium">Curo</span>
              </div>
              <div className="pipeline-arrow text-[#1D1D1F] text-2xl">→</div>
              <div className="pipeline-node flex flex-col items-center">
                <SiRailway className="w-10 h-10 md:w-8 md:h-8 text-[#0B0D0E]" />
                <span className="text-xs text-[#6E6E73] mt-2 font-sans">Railway</span>
              </div>
              <div className="pipeline-node flex flex-col items-center">
                <FaAws className="w-10 h-10 md:w-8 md:h-8 text-[#FF9900]" />
                <span className="text-xs text-[#6E6E73] mt-2 font-sans">AWS</span>
              </div>
              <div className="pipeline-node flex flex-col items-center">
                <SiVercel className="w-10 h-10 md:w-8 md:h-8 text-[#000000]" />
                <span className="text-xs text-[#6E6E73] mt-2 font-sans">Vercel</span>
              </div>
            </div>
            <div className="absolute -bottom-4 flex gap-3">
              {['Development', 'Staging', 'Production'].map((env, i) => (
                <div key={i} className="env-flow-badge px-3 py-1.5 bg-white rounded-full border border-[#E5E5EA] text-xs text-[#1D1D1F] font-sans font-medium shadow-sm">
                  {env}
                </div>
              ))}
            </div>
          </div>

          <div className="final-cta-wrapper absolute inset-0 flex flex-col items-center justify-center pointer-events-auto">
            <h2 className="text-4xl md:text-[64px] leading-[1.1] font-medium text-[#1D1D1F] tracking-tight text-center mb-8">
              Ready to centralize and sync?
            </h2>
            <Button variant="secondary" size="md" className="px-8 py-4 text-lg shadow-lg rounded-[5px]">
              Get Started for Free
            </Button>
          </div>

        </div>
        </div>
      </div>
      <style>{`
        @keyframes blink { 0%, 100% { border-color: transparent; } 50% { border-color: #64D2FF; } }
      `}</style>
    </div>
  );
}
