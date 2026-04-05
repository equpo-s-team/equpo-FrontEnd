import type { PlayerStats, SessionInfo } from '../types/hud';

export const mockSession: SessionInfo = {
  elapsedSeconds: 1254,
  connectedUsers: 4,
  maxUsers: 8,
  fps: 60,
  ping: 24,
  items: 156,
  score: 12500,
  level: 12,
};

export const mockSessionLowFPS: SessionInfo = {
  elapsedSeconds: 3600,
  connectedUsers: 7,
  maxUsers: 8,
  fps: 45,
  ping: 55,
  items: 342,
  score: 45800,
  level: 23,
};

export const mockSessionHighPing: SessionInfo = {
  elapsedSeconds: 180,
  connectedUsers: 2,
  maxUsers: 4,
  fps: 144,
  ping: 120,
  items: 23,
  score: 1500,
  level: 3,
};

export const mockSessionEmpty: SessionInfo = {
  elapsedSeconds: 0,
  connectedUsers: 0,
  maxUsers: 8,
  fps: 60,
  ping: 12,
  items: 0,
  score: 0,
  level: 1,
};

export const mockPlayerStats: PlayerStats = {
  hp: 75,
  maxHp: 100,
  energy: 40,
  maxEnergy: 100,
};

export const mockPlayerStatsFull: PlayerStats = {
  hp: 100,
  maxHp: 100,
  energy: 100,
  maxEnergy: 100,
};

export const mockPlayerStatsLow: PlayerStats = {
  hp: 15,
  maxHp: 100,
  energy: 10,
  maxEnergy: 100,
};
