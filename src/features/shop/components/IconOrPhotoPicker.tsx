import {
  Award,
  Cake,
  Camera,
  Check,
  Coffee,
  Coins,
  Crown,
  Film,
  Gem,
  Gift,
  Heart,
  type LucideIcon,
  Music,
  Pizza,
  Rocket,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from 'lucide-react';
import React, { useRef, useState } from 'react';

import { cn } from '@/lib/utils/utils.ts';

export const LUCIDE_ICON_PREFIX = 'lucide:';

const ICON_OPTIONS: { name: string; icon: LucideIcon }[] = [
  { name: 'Gift', icon: Gift },
  { name: 'Star', icon: Star },
  { name: 'Trophy', icon: Trophy },
  { name: 'Crown', icon: Crown },
  { name: 'Gem', icon: Gem },
  { name: 'Heart', icon: Heart },
  { name: 'Zap', icon: Zap },
  { name: 'Coffee', icon: Coffee },
  { name: 'Pizza', icon: Pizza },
  { name: 'Music', icon: Music },
  { name: 'Film', icon: Film },
  { name: 'Award', icon: Award },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Cake', icon: Cake },
  { name: 'Rocket', icon: Rocket },
  { name: 'Coins', icon: Coins },
];

const ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(
  ICON_OPTIONS.map(({ name, icon }) => [name, icon]),
);

export function renderRewardIcon(
  iconURL: string | null | undefined,
  size = 24,
  className?: string,
): React.ReactNode {
  if (!iconURL) return null;
  if (iconURL.startsWith(LUCIDE_ICON_PREFIX)) {
    const name = iconURL.slice(LUCIDE_ICON_PREFIX.length);
    const Icon = ICON_MAP[name];
    return Icon ? <Icon size={size} className={className} /> : null;
  }
  return (
    <img
      src={iconURL}
      alt=""
      className={cn('object-cover', className)}
      style={{ width: size, height: size }}
    />
  );
}

type PickerTab = 'icon' | 'photo';

interface IconOrPhotoPickerProps {
  value: string | null;
  onChange: (value: string | null) => void;
  onFileSelected: (file: File | null) => void;
  photoPreview: string | null;
}

export function IconOrPhotoPicker({
  value,
  onChange,
  onFileSelected,
  photoPreview,
}: IconOrPhotoPickerProps) {
  const [tab, setTab] = useState<PickerTab>(() =>
    value && !value.startsWith(LUCIDE_ICON_PREFIX) ? 'photo' : 'icon',
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedIconName = value?.startsWith(LUCIDE_ICON_PREFIX)
    ? value.slice(LUCIDE_ICON_PREFIX.length)
    : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    onFileSelected(file);
    onChange(null); // URL will be set after upload
  };

  const handleIconSelect = (name: string) => {
    onFileSelected(null);
    onChange(`${LUCIDE_ICON_PREFIX}${name}`);
  };

  const accent = 'linear-gradient(135deg, #60AFFF, #9b7fe1)';

  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold uppercase tracking-widest text-grey-400 dark:text-grey-500 block">
        Icono o imagen
      </label>

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 bg-secondary dark:bg-gray-700 rounded-xl w-fit">
        {(['icon', 'photo'] as PickerTab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
              tab === t
                ? 'bg-white dark:bg-gray-800 text-grey-800 dark:text-grey-200 shadow-sm'
                : 'text-grey-400 dark:text-grey-500 hover:text-grey-600',
            )}
          >
            {t === 'icon' ? 'Icono' : 'Foto'}
          </button>
        ))}
      </div>

      {tab === 'icon' ? (
        <div className="grid grid-cols-8 gap-2">
          {ICON_OPTIONS.map(({ name, icon: Icon }) => (
            <button
              key={name}
              type="button"
              onClick={() => handleIconSelect(name)}
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center transition-all border cursor-pointer',
                selectedIconName === name
                  ? 'border-blue/60 text-blue bg-blue/10'
                  : 'border-grey-150 dark:border-gray-600 text-grey-500 dark:text-grey-400 hover:border-blue/30 hover:text-blue',
              )}
            >
              {selectedIconName === name && (
                <span className="sr-only">
                  <Check size={8} />
                </span>
              )}
              <Icon size={16} />
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-start gap-2">
          <button
            type="button"
            className="w-20 h-20 rounded-2xl border-2 border-dashed border-grey-200 dark:border-gray-600 overflow-hidden flex items-center justify-center bg-secondary dark:bg-gray-700 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {photoPreview ? (
              <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <Camera size={24} className="text-grey-400" />
            )}
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 text-xs font-semibold text-white px-3 py-1.5 rounded-xl cursor-pointer transition-all hover:opacity-90 active:scale-95"
            style={{ background: accent }}
          >
            <Camera size={12} />
            {photoPreview ? 'Cambiar foto' : 'Subir foto'}
          </button>
          <p className="text-[10px] text-grey-400 dark:text-grey-500">JPG, PNG, GIF — máx. 5 MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
}
