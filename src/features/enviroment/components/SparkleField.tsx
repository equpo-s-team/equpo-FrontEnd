import { Sparkle, Sparkles } from 'lucide-react';
import { useMemo } from 'react';

import type { SparkleParticle } from '../types/hud';

function generateParticles(count: number): SparkleParticle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 10 + Math.floor(Math.random() * 14),
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
    type: Math.random() > 0.5 ? 'sparkle' : 'sparkles',
    opacity: 0.08 + Math.random() * 0.18,
  }));
}

export default function SparkleField() {
  const particles = useMemo(() => generateParticles(28), []);

  return (
    <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
            animation: `sparkle-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        >
          {p.type === 'sparkle' ? (
            <Sparkle size={p.size} className="text-white" strokeWidth={1.2} />
          ) : (
            <Sparkles size={p.size} className="text-white" strokeWidth={1.2} />
          )}
        </div>
      ))}
    </div>
  );
}
