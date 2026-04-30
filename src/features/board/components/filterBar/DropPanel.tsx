import {useEffect, useRef} from "react";

import {type dropPanelProp} from "@/features/board/types";

export function DropPanel({ open, onClose, children, className = '' }: dropPanelProp) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className={`
        absolute top-[calc(100%+8px)] left-0 z-[300]
        bg-primary border-[1.5px] border-grey-200
        rounded-[10px] shadow-card-lg
        overflow-hidden animate-fade-down
        min-w-60
        ${className}
      `}
    >
      {children}
    </div>
  );
}
