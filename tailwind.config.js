/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          DEFAULT: '#89D99D',
          light: 'rgba(137,217,157,0.12)',
          dark: '#4fb86a',
          deep: '#2a7040',
        },
        cyan: {
          DEFAULT: '#69E8F0',
          light: 'rgba(105,232,240,0.10)',
        },
        dark: {
          DEFAULT: '#0f1a14',
          mid: '#1c2b21',
        },
        offwhite: '#f7faf8',
        muted: '#7a8f7e',
        border: '#e2ece5',
      },
      fontFamily: {
        maxwell: ['Maxwell', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(2.4rem, 4.5vw, 3.8rem)', { lineHeight: '1.07', letterSpacing: '-0.035em' }],
        'display-lg': ['clamp(1.8rem, 3vw, 2.6rem)', { lineHeight: '1.15', letterSpacing: '-0.03em' }],
        'display-md': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
      },
      animation: {
        'float-orb': 'floatOrb 6s ease-in-out infinite',
        'float-orb-fast': 'floatOrb 4s ease-in-out infinite',
        'rotate-conic': 'rotateConic 12s linear infinite',
        'orbit-slow': 'orbitSpin 20s linear infinite',
        'orbit-slow-rev': 'orbitSpin 30s linear infinite reverse',
        'float-card': 'floatCard 5s ease-in-out infinite',
      },
      keyframes: {
        floatOrb: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-18px)' },
        },
        rotateConic: {
          to: { transform: 'rotate(360deg)' },
        },
        orbitSpin: {
          to: { transform: 'rotate(360deg)' },
        },
        floatCard: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gradient-green-cyan': 'linear-gradient(135deg, #89D99D, #69E8F0)',
        'gradient-dark': 'linear-gradient(150deg, #0f1a14 0%, #0d2117 60%, #102520 100%)',
        'radial-green': 'radial-gradient(circle, rgba(137,217,157,0.12), transparent 70%)',
        'radial-cyan': 'radial-gradient(circle, rgba(105,232,240,0.08), transparent 70%)',
      },
      boxShadow: {
        'green-glow': '0 8px 32px rgba(137,217,157,0.3)',
        'green-glow-lg': '0 14px 40px rgba(137,217,157,0.4)',
        'card': '0 8px 32px rgba(0,0,0,0.08)',
        'card-lg': '0 20px 60px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
}
