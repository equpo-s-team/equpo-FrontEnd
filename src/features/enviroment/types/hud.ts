export interface SessionInfo {
  elapsedSeconds: number;
  connectedUsers: number;
  maxUsers: number;
  fps: number;
  ping: number;
  items: number;
  score: number;
  level: number;
}

export interface PlayerStats {
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
}

export interface ConnectedUser {
  id: string;
  name: string;
  gradient: string;
}

export interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  type: 'sparkle' | 'sparkles';
  opacity: number;
}