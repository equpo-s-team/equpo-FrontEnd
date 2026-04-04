import React from 'react';
import {TeamColor} from "@/features/team/index.ts";

interface ScoreRingProps {
  score: number;
  color: TeamColor;
  size?: number;
}

const COLOR_MAP: Record<TeamColor, { stroke: string; glow: string; text: string }> = {
  blue:   { stroke: '#60AFFF', glow: '#60AFFF66', text: '#60AFFF' },
  purple: { stroke: '#9b7fe1', glow: '#9b7fe166', text: '#9b7fe1' },
  green:  { stroke: '#9CEDC1', glow: '#9CEDC166', text: '#9CEDC1' },
  red:    { stroke: '#F65A70', glow: '#F65A7066', text: '#F65A70' },
  orange: { stroke: '#FF94AE', glow: '#FF94AE66', text: '#FF94AE' },
};

export const ScoreRing: React.FC<ScoreRingProps> = ({ score, color, size = 56 }) => {
  const { stroke, glow, text } = COLOR_MAP[color];
  const r = (size - 8) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={4} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={stroke} strokeWidth={4}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${glow})`, transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <span className="absolute text-xs font-semibold" style={{ color: text, fontFamily: 'DM Sans, sans-serif', fontSize: 11 }}>
        {score}%
      </span>
    </div>
  );
};
