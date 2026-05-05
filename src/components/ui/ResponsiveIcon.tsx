import { useEffect, useState } from 'react';

interface ResponsiveIconProps {
  component: React.ComponentType<{ size: number; [key: string]: any }>;
  mobileSize: number;
  desktopSize: number;
  [key: string]: any;
}

export function ResponsiveIcon({
  component: IconComponent,
  mobileSize,
  desktopSize,
  ...props
}: ResponsiveIconProps) {
  const [size, setSize] = useState(mobileSize);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 640px)');

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setSize(e.matches ? desktopSize : mobileSize);
    };

    // Set initial size
    handleChange(mediaQuery);

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mobileSize, desktopSize]);

  return <IconComponent size={size} {...props} />;
}
