export interface SessionInfo {
  elapsedSeconds: number;
  connectedUsers: number;
  maxUsers: number;
  completedPercent: number;
  overduePercent: number;
  connectedMembers: ConnectedUser[];
}

export interface PlayerStats {
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
}

export interface ConnectedUser {
  uid: string;
  id: string;
  name: string;
  photoUrl?: string | null;
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
