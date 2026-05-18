const AVATAR_GRADIENTS = [
  'bg-avatar-at',
  'bg-avatar-jr',
  'bg-avatar-ml',
  'bg-avatar-cs',
  'bg-avatar-lv',
  'bg-avatar-sr',
  'bg-avatar-dm',
];

export function getAvatarGradientClass(identifier: string): string {
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash = (hash * 31 + identifier.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
}
