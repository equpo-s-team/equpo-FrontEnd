export function ReportHeader() {
  return (
    <header className="flex items-center justify-between py-6 border-b border-grey-150 mb-8">
      {/* Logo */}
      <div className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-grey-900">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{
            background: 'linear-gradient(135deg,#60AFFF,#5961F9)',
            boxShadow: '0 0 14px rgba(96,175,255,0.85), 0 0 28px rgba(96,175,255,0.35)',
            animation: 'pulseNeon 2.4s ease-in-out infinite',
          }}
        />
        Orbit
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Live indicator */}
        <span className="flex items-center gap-1.5 text-xs font-medium text-[#2e9660]">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: '#9CEDC1',
              boxShadow: '0 0 10px rgba(156,237,193,1), 0 0 20px rgba(156,237,193,0.5)',
              animation: 'pulseNeon 1.8s ease-in-out infinite',
            }}
          />
          En vivo
        </span>
        <span className="text-xs text-grey-400 hidden sm:block">Actualizado hace 2 min</span>
      </div>
    </header>
  )
}
