import React, { useState } from 'react';
import { Moon } from 'lucide-react';

interface BurningScrollSpoilerProps {
  phrase: string;
  orderNumber?: number | string;
}

interface EmberSpark {
  id: number;
  dir: -1 | 1; // -1 for left, 1 for right
  x: number;   // horizontal offset from center (0 to 100%)
  y: number;   // vertical jitter
  size: number;
  duration: number;
  delay: number;
  color: string;
}

export const BurningScrollSpoiler: React.FC<BurningScrollSpoilerProps> = ({ phrase }) => {
  const [burned, setBurned] = useState<boolean>(false);
  const [isBurning, setIsBurning] = useState<boolean>(false);
  const [sparks, setSparks] = useState<EmberSpark[]>([]);

  const handleIgnite = () => {
    if (burned || isBurning) return;

    // Generate sparks flying left and right along the dividing line
    const colors = ['#ff4500', '#ff8c00', '#ffd700', '#ff2200', '#ffffff'];
    const newSparks: EmberSpark[] = Array.from({ length: 32 }).map((_, i) => {
      const dir = i % 2 === 0 ? -1 : 1;
      return {
        id: i,
        dir,
        x: Math.random() * 45 + 5, // percentage distance from center
        y: (Math.random() - 0.5) * 40, // vertical jitter
        size: Math.random() * 4 + 2,
        duration: Math.random() * 0.4 + 0.6,
        delay: Math.random() * 0.35,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
    });

    setSparks(newSparks);
    setIsBurning(true);

    setTimeout(() => {
      setIsBurning(false);
      setBurned(true);
    }, 1150);
  };

  const handleToggle = () => {
    if (burned) {
      setBurned(false);
      setIsBurning(false);
      setSparks([]);
    } else {
      handleIgnite();
    }
  };

  return (
    <div className="my-5 w-full select-none">
      {!burned ? (
        /* Unburned State: Yellowed Parchment Split in Two by a Central Seam with a Wax Seal */
        <div
          onClick={handleIgnite}
          className={`relative group cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-300 py-7 sm:py-8 px-4 flex items-center justify-center ${
            isBurning
              ? 'border-[#ff4500] shadow-[0_0_45px_rgba(255,69,0,0.7)]'
              : 'border-[#7a5824] hover:border-[#c59b27] shadow-[0_6px_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)]'
          }`}
          style={{
            background: isBurning
              ? 'radial-gradient(ellipse at center, #230d06 0%, #150804 50%, #070302 100%)'
              : 'linear-gradient(135deg, #d8be8d 0%, #c4a164 25%, #deb876 50%, #b88d4c 75%, #a67c3b 100%)'
          }}
        >
          {/* Burnt aged edges overlay */}
          <div
            className="absolute inset-0 pointer-events-none rounded-xl"
            style={{
              boxShadow: isBurning
                ? 'inset 0 0 50px rgba(255, 69, 0, 0.9), inset 0 0 15px rgba(255, 230, 0, 0.95)'
                : 'inset 0 0 28px rgba(60, 35, 10, 0.7), inset 0 0 8px rgba(40, 20, 5, 0.9)'
            }}
          />

          {/* Parchment fiber texture */}
          {!isBurning && (
            <div
              className="absolute inset-0 pointer-events-none opacity-25"
              style={{
                backgroundImage: 'radial-gradient(circle, #3e2608 12%, transparent 13%)',
                backgroundSize: '14px 14px'
              }}
            />
          )}

          {/* Dividing Seam Line separating the scroll into two parts */}
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none">
            <div className="h-[2px] w-full bg-gradient-to-r from-[#5a3b14]/70 via-[#362108] to-[#5a3b14]/70 shadow-[0_1px_1px_rgba(255,255,255,0.35)]" />
            <div className="h-[1px] w-full bg-[#1e1104]/50" />
          </div>

          {/* Horizontal Burning Flame Waves spreading in TWO directions: LEFT and RIGHT */}
          {isBurning && (
            <>
              {/* Left Fire Wave (From center to left edge) */}
              <div
                className="absolute top-1/2 -translate-y-1/2 pointer-events-none animate-burnSpreadLeft"
                style={{
                  height: '100%',
                  right: '50%',
                  background:
                    'linear-gradient(to left, rgba(255,230,0,1) 0%, rgba(255,69,0,0.95) 25%, rgba(185,28,28,0.85) 60%, rgba(18,6,4,0.95) 100%)',
                  boxShadow: '0 0 35px #ff4500, 0 0 70px #ff8c00',
                  mixBlendMode: 'screen'
                }}
              />

              {/* Right Fire Wave (From center to right edge) */}
              <div
                className="absolute top-1/2 -translate-y-1/2 pointer-events-none animate-burnSpreadRight"
                style={{
                  height: '100%',
                  left: '50%',
                  background:
                    'linear-gradient(to right, rgba(255,230,0,1) 0%, rgba(255,69,0,0.95) 25%, rgba(185,28,28,0.85) 60%, rgba(18,6,4,0.95) 100%)',
                  boxShadow: '0 0 35px #ff4500, 0 0 70px #ff8c00',
                  mixBlendMode: 'screen'
                }}
              />

              {/* Glowing horizontal ignite seam */}
              <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-2 bg-gradient-to-r from-[#ff4500] via-[#ffff00] to-[#ff4500] blur-[2px] animate-pulse pointer-events-none" />
            </>
          )}

          {/* Sparks shooting left and right along the dividing line */}
          {isBurning &&
            sparks.map(s => (
              <span
                key={s.id}
                className="absolute top-1/2 rounded-full pointer-events-none"
                style={{
                  left: `calc(50% + ${s.dir * s.x}%)`,
                  top: `calc(50% + ${s.y}px)`,
                  width: `${s.size}px`,
                  height: `${s.size}px`,
                  backgroundColor: s.color,
                  boxShadow: `0 0 ${s.size * 2.5}px ${s.color}`,
                  animation: `sparkPop ${s.duration}s ease-out ${s.delay}s forwards`
                }}
              />
            ))}

          {/* Realistic Wax Seal in the Center (Replaces the fire button) */}
          <div className="relative z-20 flex items-center justify-center">
            <button
              type="button"
              className={`relative rounded-full flex items-center justify-center transition-all duration-300 ${
                isBurning
                  ? 'w-16 h-16 sm:w-18 sm:h-18 scale-110 shadow-[0_0_35px_#ff4500]'
                  : 'w-14 h-14 sm:w-16 sm:h-16 shadow-[0_6px_16px_rgba(0,0,0,0.7),inset_0_2px_4px_rgba(255,255,255,0.3)] hover:scale-108 hover:shadow-[0_0_25px_rgba(220,38,38,0.75)]'
              }`}
              style={{
                background: isBurning
                  ? 'radial-gradient(circle at 35% 35%, #ff4500 0%, #b91c1c 50%, #450a0a 100%)'
                  : 'radial-gradient(circle at 35% 35%, #8e1520 0%, #680d15 50%, #3d050a 100%)',
                border: isBurning ? '2px solid #ffea00' : '2px solid #a31a26'
              }}
            >
              {/* Inner stamped rim of the wax seal */}
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border transition-all ${
                  isBurning
                    ? 'border-[#ffea00] bg-[#4a0a0e]/60'
                    : 'border-[#50080d] bg-[#5c0b12]/50 group-hover:border-[#fca5a5]'
                }`}
              >
                {/* Lombre's Crescent Moon insignia stamped into the seal */}
                <Moon
                  size={20}
                  className={`transition-all ${
                    isBurning
                      ? 'text-[#ffffff] animate-spin'
                      : 'text-[#fca5a5] group-hover:text-[#ffffff] group-hover:drop-shadow-[0_0_6px_#ffffff]'
                  }`}
                  style={{
                    filter: isBurning
                      ? 'drop-shadow(0 0 8px #ffffff)'
                      : 'drop-shadow(1px 2px 2px rgba(0, 0, 0, 0.8))'
                  }}
                />
              </div>

              {/* Organic melted wax drips effect */}
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#680d15] opacity-80" />
              <div className="absolute -bottom-1 -left-1 w-3.5 h-3.5 rounded-full bg-[#52090f] opacity-85" />
              <div className="absolute top-2 -left-1.5 w-2.5 h-2.5 rounded-full bg-[#5c0b12] opacity-75" />
            </button>
          </div>
        </div>
      ) : (
        /* Revealed State: ONLY the text of the message, inside charred stone */
        <div
          onClick={handleToggle}
          title="Нажмите, чтобы запечатать обратно"
          className="relative overflow-hidden rounded-xl border-2 border-[#7f1d1d] py-6 sm:py-7 px-6 shadow-[0_0_30px_rgba(185,28,28,0.3)] transition-all animate-fadeIn cursor-pointer group"
          style={{
            background: 'linear-gradient(135deg, #120a0b 0%, #1c0e10 40%, #0d0607 70%, #070304 100%)'
          }}
        >
          {/* Subtle ash soot vignette */}
          <div
            className="absolute inset-0 pointer-events-none rounded-xl"
            style={{
              boxShadow: 'inset 0 0 35px rgba(0, 0, 0, 0.95), inset 0 0 12px rgba(185, 28, 28, 0.35)'
            }}
          />

          {/* Charred ash edge border shimmer */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ef4444] to-transparent opacity-75" />
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#b91c1c] to-transparent opacity-50" />

          {/* ONLY the Revealed Maxim - centered, impactful, zero extra phrases */}
          <div className="relative z-10 flex items-center justify-center text-center">
            <span className="text-xl sm:text-2xl lg:text-3xl font-heading font-black tracking-widest uppercase text-[#fecaca] drop-shadow-[0_0_14px_rgba(239,68,68,0.85)] py-2">
              {phrase}
            </span>
          </div>
        </div>
      )}

      {/* Embedded CSS Animations for Left & Right Fire Sweep */}
      <style>{`
        @keyframes burnSpreadLeft {
          0% {
            width: 0%;
            opacity: 1;
          }
          70% {
            width: 52%;
            opacity: 1;
          }
          100% {
            width: 55%;
            opacity: 0.85;
          }
        }
        @keyframes burnSpreadRight {
          0% {
            width: 0%;
            opacity: 1;
          }
          70% {
            width: 52%;
            opacity: 1;
          }
          100% {
            width: 55%;
            opacity: 0.85;
          }
        }
        @keyframes sparkPop {
          0% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
          50% {
            transform: scale(1.4) translateY(-15px);
            opacity: 0.9;
          }
          100% {
            transform: scale(0.2) translateY(-30px);
            opacity: 0;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .animate-burnSpreadLeft {
          animation: burnSpreadLeft 1.1s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .animate-burnSpreadRight {
          animation: burnSpreadRight 1.1s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}</style>
    </div>
  );
};