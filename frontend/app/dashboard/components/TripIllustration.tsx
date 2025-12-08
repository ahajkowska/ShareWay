"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { TripAccentPreset } from "@/lib/types/trip";

interface TripIllustrationProps {
  preset: TripAccentPreset;
  className?: string;
}

const palette: Record<TripAccentPreset, string> = {
  beach: "text-sky-500 dark:text-sky-300",
  mountains: "text-indigo-500 dark:text-indigo-300",
  city: "text-orange-500 dark:text-orange-300",
  desert: "text-amber-500 dark:text-amber-300",
  tropical: "text-emerald-500 dark:text-emerald-300",
  winter: "text-sky-400 dark:text-sky-200",
  lake: "text-indigo-500 dark:text-cyan-300",
  countryside: "text-emerald-500 dark:text-emerald-300",
  adventure: "text-orange-500 dark:text-lime-400",
  neutral: "text-slate-500 dark:text-slate-300",
};

const soft = (alpha: number) => ({
  style: { opacity: alpha },
  fill: "currentColor",
  stroke: "currentColor",
});

function BeachScene() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-full text-current" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="beachSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="beachWater" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.18" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="200" height="50" fill="url(#beachSky)" />

      <motion.circle
        cx="160"
        cy="20"
        r="12"
        fill="currentColor"
        {...soft(0.55)}
        animate={{ scale: [1, 1.08, 1], opacity: [0.55, 0.78, 0.55] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <motion.line
          key={angle}
          x1={160 + Math.cos((angle * Math.PI) / 180) * 16}
          y1={20 + Math.sin((angle * Math.PI) / 180) * 16}
          x2={160 + Math.cos((angle * Math.PI) / 180) * 22}
          y2={20 + Math.sin((angle * Math.PI) / 180) * 22}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          {...soft(0.35)}
          animate={{ opacity: [0.25, 0.6, 0.25] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
        />
      ))}

      <motion.path
        d="M0,55 Q25,50 50,55 T100,55 T150,55 T200,55 L200,80 L0,80 Z"
        fill="url(#beachWater)"
        animate={{
          d: [
            "M0,55 Q25,50 50,55 T100,55 T150,55 T200,55 L200,80 L0,80 Z",
            "M0,55 Q25,60 50,55 T100,55 T150,55 T200,55 L200,80 L0,80 Z",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />
      <motion.path
        d="M0,62 Q30,58 60,62 T120,62 T180,62 T200,62 L200,80 L0,80 Z"
        fill="currentColor"
        {...soft(0.22)}
        animate={{
          d: [
            "M0,62 Q30,58 60,62 T120,62 T180,62 T200,62 L200,80 L0,80 Z",
            "M0,62 Q30,66 60,62 T120,62 T180,62 T200,62 L200,80 L0,80 Z",
          ],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      <motion.g
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "30px 80px" }}
      >
        <path
          d="M30,80 L32,50 M32,50 Q20,45 15,40 M32,50 Q40,42 50,40 M32,50 Q25,38 28,30"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          {...soft(0.55)}
        />
      </motion.g>

      <motion.g
        animate={{ x: [0, 30, 0], y: [0, -3, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        <path d="M70,25 Q73,22 76,25" stroke="currentColor" strokeWidth="1" fill="none" {...soft(0.38)} />
        <path d="M80,20 Q83,17 86,20" stroke="currentColor" strokeWidth="1" fill="none" {...soft(0.3)} />
      </motion.g>
    </svg>
  );
}

function MountainScene() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-full text-current" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="mountainSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.06" />
        </linearGradient>
        <linearGradient id="mountain1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.55" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.28" />
        </linearGradient>
        <linearGradient id="mountain2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="200" height="80" fill="url(#mountainSky)" />
      <path d="M-20,80 L30,35 L50,50 L80,25 L110,55 L140,30 L170,50 L220,80 Z" fill="url(#mountain2)" />
      <path d="M-10,80 L40,45 L70,60 L100,35 L130,55 L160,40 L200,60 L200,80 Z" fill="url(#mountain1)" />

      <path d="M100,35 L95,42 L100,40 L105,42 Z" fill="currentColor" opacity={0.2} />
      <path d="M80,25 L74,34 L80,31 L86,34 Z" fill="currentColor" opacity={0.2} />

      <motion.g animate={{ x: [0, 18, 0] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}>
        <ellipse cx="40" cy="20" rx="15" ry="6" fill="currentColor" opacity={0.35} />
        <ellipse cx="50" cy="18" rx="10" ry="5" fill="currentColor" opacity={0.35} />
      </motion.g>

      <motion.g animate={{ x: [0, -15, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}>
        <ellipse cx="150" cy="15" rx="12" ry="5" fill="currentColor" opacity={0.28} />
        <ellipse cx="158" cy="13" rx="8" ry="4" fill="currentColor" opacity={0.28} />
      </motion.g>

      <g fill="currentColor" opacity={0.38}>
        <path d="M20,80 L25,65 L22,65 L27,55 L24,55 L28,45 L32,55 L29,55 L34,65 L31,65 L36,80 Z" />
        <path d="M175,80 L179,68 L177,68 L181,60 L179,60 L182,52 L185,60 L183,60 L187,68 L185,68 L189,80 Z" />
      </g>
    </svg>
  );
}

function CityScene() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-full text-current" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="citySky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="200" height="80" fill="url(#citySky)" />

      {[{ x: 20, y: 15 }, { x: 50, y: 10 }, { x: 90, y: 8 }, { x: 140, y: 12 }, { x: 175, y: 18 }].map((star, i) => (
        <motion.circle
          key={i}
          cx={star.x}
          cy={star.y}
          r="1"
          fill="currentColor"
          opacity={0.5}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}

      <g fill="currentColor" opacity={0.2}>
        <rect x="5" y="50" width="15" height="30" />
        <rect x="25" y="40" width="12" height="40" />
        <rect x="60" y="45" width="18" height="35" />
        <rect x="100" y="35" width="14" height="45" />
        <rect x="140" y="42" width="20" height="38" />
        <rect x="175" y="48" width="15" height="32" />
      </g>

      <g fill="currentColor" opacity={0.4}>
        <rect x="15" y="55" width="18" height="25" />
        <rect x="40" y="38" width="16" height="42" />
        <rect x="82" y="30" width="14" height="50" />
        <rect x="118" y="45" width="18" height="35" />
        <rect x="155" y="50" width="16" height="30" />
      </g>

      {[{ x: 42, y: 42 }, { x: 48, y: 42 }, { x: 84, y: 35 }, { x: 90, y: 35 }, { x: 120, y: 50 }].map((win, i) => (
        <motion.rect
          key={i}
          x={win.x}
          y={win.y}
          width="3"
          height="4"
          fill="currentColor"
          opacity={0.6}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      <line x1="89" y1="30" x2="89" y2="22" stroke="currentColor" strokeWidth="1" opacity={0.5} />
      <motion.circle cx="89" cy="21" r="1.5" fill="currentColor" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }} />

      <motion.g animate={{ x: [-20, 220] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}>
        <path d="M0,20 L8,18 L10,20 L8,22 Z" fill="currentColor" opacity={0.35} />
      </motion.g>
    </svg>
  );
}

function DesertScene() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-full text-current" preserveAspectRatio="xMidYMid slice">
      <rect x="0" y="0" width="200" height="80" fill="currentColor" opacity={0.1} />
      <motion.circle cx="160" cy="18" r="14" fill="currentColor" opacity={0.6} animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
      <path d="M0,60 Q50,45 100,55 T200,50 V80 H0 Z" fill="currentColor" opacity={0.3} />
      <path d="M0,68 Q80,55 150,65 T200,60 V80 H0 Z" fill="currentColor" opacity={0.35} />
      <path d="M40,70 L60,40 L80,70 Z" fill="currentColor" opacity={0.4} />
      <path d="M60,40 L80,70 L60,70 Z" fill="currentColor" opacity={0.3} />
      <path d="M100,70 L115,50 L130,70 Z" fill="currentColor" opacity={0.32} />
    </svg>
  );
}

function TropicalScene() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-full text-current" preserveAspectRatio="xMidYMid slice">
      <rect x="0" y="0" width="200" height="80" fill="currentColor" opacity={0.12} />
      <motion.g animate={{ rotate: [0, 360] }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "165px 20px" }}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <line
            key={angle}
            x1="165"
            y1="20"
            x2={165 + Math.cos((angle * Math.PI) / 180) * 18}
            y2={20 + Math.sin((angle * Math.PI) / 180) * 18}
            stroke="currentColor"
            strokeWidth="1.5"
            opacity={0.25}
          />
        ))}
      </motion.g>
      <circle cx="165" cy="20" r="10" fill="currentColor" opacity={0.5} />
      <motion.path
        d="M0,58 Q30,52 60,58 T120,58 T180,58 T200,58 V80 H0 Z"
        fill="currentColor"
        opacity={0.3}
        animate={{
          d: [
            "M0,58 Q30,52 60,58 T120,58 T180,58 T200,58 V80 H0 Z",
            "M0,58 Q30,64 60,58 T120,58 T180,58 T200,58 V80 H0 Z",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      />
      <ellipse cx="100" cy="65" rx="35" ry="8" fill="currentColor" opacity={0.25} />
    </svg>
  );
}

function WinterScene() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-full text-current" preserveAspectRatio="xMidYMid slice">
      <rect x="0" y="0" width="200" height="80" fill="currentColor" opacity={0.12} />
      <path d="M0,55 Q50,50 100,55 T200,52 V80 H0 Z" fill="white" opacity={0.7} />
      <path d="M0,62 Q60,58 120,64 T200,60 V80 H0 Z" fill="white" opacity={0.65} />
      {[15, 45, 75, 120, 160, 185].map((x, i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={8 + i * 4}
          r="1.5"
          fill="white"
          opacity={0.7}
          animate={{ y: [0, 70], opacity: [1, 0] }}
          transition={{ duration: 3 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}
    </svg>
  );
}

function LakeScene() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-full text-current" preserveAspectRatio="xMidYMid slice">
      <rect x="0" y="0" width="200" height="80" fill="currentColor" opacity={0.1} />
      <circle cx="100" cy="32" r="12" fill="currentColor" opacity={0.3} />
      <ellipse cx="100" cy="32" rx="22" ry="8" fill="currentColor" opacity={0.2} />
      <path d="M0,50 L35,28 L70,50 Z" fill="currentColor" opacity={0.28} />
      <path d="M50,50 L95,20 L140,50 Z" fill="currentColor" opacity={0.25} />
      <path d="M120,50 L160,30 L200,50 Z" fill="currentColor" opacity={0.22} />
      <path d="M0,50 Q100,46 200,50 V80 H0 Z" fill="currentColor" opacity={0.35} />
    </svg>
  );
}

function CountrysideScene() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-full text-current" preserveAspectRatio="xMidYMid slice">
      <rect x="0" y="0" width="200" height="80" fill="currentColor" opacity={0.12} />
      <circle cx="160" cy="18" r="10" fill="currentColor" opacity={0.45} />
      <path d="M0,55 Q50,45 100,52 T200,48 V80 H0 Z" fill="currentColor" opacity={0.3} />
      <path d="M0,62 Q70,52 140,58 T200,55 V80 H0 Z" fill="currentColor" opacity={0.35} />
      <path d="M0,70 Q80,62 160,68 T200,65 V80 H0 Z" fill="currentColor" opacity={0.35} />
    </svg>
  );
}

function AdventureScene() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-full text-current" preserveAspectRatio="xMidYMid slice">
      <rect x="0" y="0" width="200" height="80" fill="currentColor" opacity={0.12} />
      <circle cx="165" cy="22" r="14" fill="currentColor" opacity={0.55} />
      <path d="M0,45 Q30,35 60,42 T120,38 T180,42 T200,38 V80 H0 Z" fill="currentColor" opacity={0.28} />
      <path d="M0,52 Q40,45 80,50 T160,48 T200,52 V80 H0 Z" fill="currentColor" opacity={0.32} />
      <motion.path
        d="M0,68 Q50,62 100,68 T200,65 V75 Q150,72 100,75 T0,72 Z"
        fill="currentColor"
        opacity={0.3}
        animate={{
          d: [
            "M0,68 Q50,62 100,68 T200,65 V75 Q150,72 100,75 T0,72 Z",
            "M0,68 Q50,66 100,66 T200,63 V75 Q150,74 100,77 T0,74 Z",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
      />
    </svg>
  );
}

function NeutralScene() {
  return (
    <svg viewBox="0 0 200 80" className="w-full h-full text-current" preserveAspectRatio="xMidYMid slice">
      <rect x="0" y="0" width="200" height="80" fill="currentColor" opacity={0.08} />
      <motion.g style={{ transformOrigin: "100px 40px" }} animate={{ rotate: [0, 360] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
        <circle cx="100" cy="40" r="20" stroke="currentColor" strokeWidth="1" opacity={0.15} fill="none" />
        <circle cx="100" cy="40" r="15" stroke="currentColor" strokeWidth="1" opacity={0.1} fill="none" />
        <path d="M100,20 L103,35 L100,32 L97,35 Z" fill="currentColor" opacity={0.25} />
        <path d="M100,60 L103,45 L100,48 L97,45 Z" fill="currentColor" opacity={0.2} />
      </motion.g>
      <motion.path
        d="M20,60 Q50,30 80,50 T140,35 T180,55"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 4"
        fill="none"
        opacity={0.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

export default function TripIllustration({ preset, className }: TripIllustrationProps) {
  const scenes: Record<TripAccentPreset, JSX.Element> = {
    beach: <BeachScene />,
    mountains: <MountainScene />,
    city: <CityScene />,
    desert: <DesertScene />,
    tropical: <TropicalScene />,
    winter: <WinterScene />,
    lake: <LakeScene />,
    countryside: <CountrysideScene />,
    adventure: <AdventureScene />,
    neutral: <NeutralScene />,
  };

  return (
    <div className={cn("overflow-hidden", palette[preset], className)}>
      {scenes[preset]}
    </div>
  );
}
