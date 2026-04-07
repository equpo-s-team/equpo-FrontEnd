import type { PlayerStats, SessionInfo } from '../types/hud';

export const mockSession: SessionInfo = {
  elapsedSeconds: 1254,
  connectedUsers: 4,
  maxUsers: 8,
  completedPercent: 62,
  overduePercent: 8,
  connectedMembers: [],
};

export const mockSessionLowFPS: SessionInfo = {
  elapsedSeconds: 3600,
  connectedUsers: 7,
  maxUsers: 8,
  completedPercent: 74,
  overduePercent: 12,
  connectedMembers: [],
};

export const mockSessionHighPing: SessionInfo = {
  elapsedSeconds: 180,
  connectedUsers: 2,
  maxUsers: 4,
  completedPercent: 24,
  overduePercent: 28,
  connectedMembers: [],
};

export const mockSessionEmpty: SessionInfo = {
  elapsedSeconds: 0,
  connectedUsers: 0,
  maxUsers: 8,
  completedPercent: 0,
  overduePercent: 0,
  connectedMembers: [],
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
