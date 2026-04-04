import {Team} from "@/features/team/index.ts";

export const MOCK_TEAMS: Team[] = [
  {
    id: '1',
    name: 'Producto & Diseño',
    description: 'Iteramos rápido, fallamos rápido, aprendemos más rápido.',
    score: 87,
    color: 'blue',
    createdAt: '2024-11-01',
    members: [
      { id: 'u1', name: 'Ana Torres', email: 'ana@acme.io', role: 'owner', avatarInitials: 'AT', avatarGradient: 'avatar-at', joinedAt: '2024-11-01' },
      { id: 'u2', name: 'José Ruiz', email: 'jose@acme.io', role: 'admin', avatarInitials: 'JR', avatarGradient: 'avatar-jr', joinedAt: '2024-11-03' },
      { id: 'u3', name: 'María López', email: 'maria@acme.io', role: 'member', avatarInitials: 'ML', avatarGradient: 'avatar-ml', joinedAt: '2024-11-10' },
    ],
  },
  {
    id: '2',
    name: 'Ingeniería Core',
    description: 'Arquitectura limpia, sistemas resilientes, cero deuda técnica.',
    score: 92,
    color: 'purple',
    createdAt: '2024-10-15',
    members: [
      { id: 'u4', name: 'Carlos Soto', email: 'carlos@acme.io', role: 'owner', avatarInitials: 'CS', avatarGradient: 'avatar-cs', joinedAt: '2024-10-15' },
      { id: 'u5', name: 'Lucía Vega', email: 'lucia@acme.io', role: 'member', avatarInitials: 'LV', avatarGradient: 'avatar-lv', joinedAt: '2024-10-20' },
    ],
  },
  {
    id: '3',
    name: 'Growth & Marketing',
    description: 'Crecimiento orgánico impulsado por datos y creatividad.',
    score: 64,
    color: 'green',
    createdAt: '2024-12-01',
    members: [
      { id: 'u6', name: 'Diego Mora', email: 'diego@acme.io', role: 'owner', avatarInitials: 'DM', avatarGradient: 'avatar-dm', joinedAt: '2024-12-01' },
      { id: 'u7', name: 'Sara Ríos', email: 'sara@acme.io', role: 'admin', avatarInitials: 'SR', avatarGradient: 'avatar-sr', joinedAt: '2024-12-05' },
      { id: 'u1', name: 'Ana Torres', email: 'ana@acme.io', role: 'member', avatarInitials: 'AT', avatarGradient: 'avatar-at', joinedAt: '2024-12-08' },
    ],
  },
];

export const CURRENT_USER = {
  id: 'u1',
  name: 'Ana Torres',
  email: 'ana@acme.io',
  role: 'Product Lead',
  avatarInitials: 'AT',
  avatarGradient: 'avatar-at',
  joinedAt: 'Noviembre 2024',
  teamsCount: 2,
  tasksCompleted: 47,
};
