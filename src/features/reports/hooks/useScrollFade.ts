import { useCallback, useRef, useState } from 'react';

export function useScrollFade() {
  const [atBottom, setAtBottom] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const onScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 4);
  }, []);

  return { ref, atBottom, onScroll };
}
