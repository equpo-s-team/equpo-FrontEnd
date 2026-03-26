export function NeonBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div
        className="absolute rounded-full"
        style={{
          width: 560, height: 560,
          background: 'rgba(96,175,255,0.11)',
          filter: 'blur(90px)',
          top: -140, left: -80,
          animation: 'floatOrb 9s ease-in-out infinite',
          animationDelay: '0s',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 440, height: 440,
          background: 'rgba(156,237,193,0.10)',
          filter: 'blur(90px)',
          bottom: -60, right: -80,
          animation: 'floatOrb 9s ease-in-out infinite',
          animationDelay: '-3.5s',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 380, height: 380,
          background: 'rgba(89,97,249,0.07)',
          filter: 'blur(90px)',
          top: '35%', left: '50%',
          animation: 'floatOrb 9s ease-in-out infinite',
          animationDelay: '-6s',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 300, height: 300,
          background: 'rgba(255,148,174,0.08)',
          filter: 'blur(90px)',
          bottom: '15%', left: '15%',
          animation: 'floatOrb 9s ease-in-out infinite',
          animationDelay: '-2s',
        }}
      />
    </div>
  )
}
