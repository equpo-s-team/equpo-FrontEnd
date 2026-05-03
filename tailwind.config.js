/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFFFFF',
          foreground: '#1A1A1A',
        },
        secondary: {
          DEFAULT: '#F5F4F1',
          foreground: '#3A3A3A',
        },
        tertiary: {
          DEFAULT: '#dcdcd9',
          foreground: '#575757',
        },
        blue: {
          DEFAULT: '#60AFFF',
          foreground: '#86F0FD',
        },
        red: {
          DEFAULT: '#F65A70',
          foreground: '#FFAF93',
        },
        orange: {
          DEFAULT: '#FF94AE',
          foreground: '#FCE98D',
          dark: '#ffb048ff',
        },
        purple: {
          DEFAULT: '#5961F9',
          foreground: '#9b7fe1',
        },
        green: {
          DEFAULT: '#65d295',
          foreground: '#CEFB7C',
        },
        grey: {
          50: '#FAFAF8',
          100: '#F5F4F1',
          150: '#EEECEA',
          200: '#E4E2DE',
          300: '#CCCAC5',
          400: '#B0ADA7',
          500: '#908E88',
          600: '#706E69',
          700: '#524F4A',
          800: '#35322E',
          900: '#1A1815',
        },
        offwhite: '#f7faf8',

        kanban: {
          todo: '#9b7fe1',
          progress: '#86F0FD',
          qa: '#FF94AE',
          done: '#9CEDC1',
        },

        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },

      backgroundImage: {
        'gradient-red-bg': 'linear-gradient(135deg, #F65A70 0%, #FFAF93 100%)',
        'gradient-orange-bg': 'linear-gradient(135deg, #FF94AE 0%, #FCE98D 100%)',
        'gradient-purple-bg': 'linear-gradient(135deg, #d99aee 0%, #5961F9 100%)',
        'gradient-blue-bg': 'linear-gradient(135deg, #60AFFF 0%, #86F0FD 100%)',
        'gradient-green-bg': 'linear-gradient(135deg, #9CEDC1 0%, #CEFB7C 100%)',
        'gradient-darkblue-bg': 'linear-gradient(135deg,#3BA3CC 0%, #273169 100%)',
        'gradient-todo-bg': 'linear-gradient(135deg, #9b7fe1 0%, #5961F9 100%)',
        'gradient-progress-bg': 'linear-gradient(135deg, #86F0FD 0%, #60AFFF 100%)',
        'gradient-qa-bg': 'linear-gradient(135deg, #FF94AE 0%, #F65A70 100%)',
        'gradient-done-bg': 'linear-gradient(135deg, #9CEDC1 0%, #CEFB7C 100%)',
        'gradient-equpo': 'linear-gradient(135deg, #9CEDC1 0%, #60AFFF 50%, #F65A70 100%)',
        'avatar-at': 'linear-gradient(135deg, #60AFFF, #5961F9)',
        'avatar-jr': 'linear-gradient(135deg, #9CEDC1, #86F0FD)',
        'avatar-ml': 'linear-gradient(135deg, #F65A70, #FF94AE)',
        'avatar-cs': 'linear-gradient(135deg, #FF94AE, #F65A70)',
        'avatar-lv': 'linear-gradient(135deg, #9b7fe1, #5961F9)',
        'avatar-dm': 'linear-gradient(135deg, #86F0FD, #60AFFF)',
        'avatar-sr': 'linear-gradient(135deg, #F65A70, #9b7fe1)',
        'animated-gradient-new': 'linear-gradient(120deg, #ffffff 0%, #f0fdf6 25%, #eff8ff 55%, #fff5f7 80%, #fdf8ff 100%)',
        'animated-gradient-new-dark': 'linear-gradient(120deg, #0f172a 0%, #1e293b 15%, #242E3D 35%, #111827 55%, #181f29 75%, #0f172a 100%)',
        'final-gradient': 'linear-gradient(150deg, #f0fdf6 0%, #eff8ff 45%, #fdf5ff 80%, #fff5f7 100%)',
        'final-gradient-dark': 'linear-gradient(150deg, #0f172a 0%, #1e293b 45%, #181f29 80%, #0f172a 100%)',
        'cta-blob-green': 'radial-gradient(circle, rgba(34,197,94,0.15), transparent 65%)',
        'cta-blob-blue': 'radial-gradient(circle, rgba(59,130,246,0.12), transparent 65%)',
        'cta-blob-purple': 'radial-gradient(ellipse, rgba(147,51,234,0.08), transparent 70%)',
        'cta-button-shadow': '0 10px 40px rgba(56,185,122,0.35), 0 4px 16px rgba(46,143,212,0.25)',
        'nucleus-blob-purple': 'radial-gradient(circle, rgba(89,97,249,0.08), transparent 70%)',
        'nucleus-blob-orange': 'radial-gradient(circle, rgba(246,90,112,0.08), transparent 70%)',
      },

      fontFamily: {
        maxwell: ['Maxwell', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },

      fontSize: {
        'display-xl': [
          'clamp(2.4rem, 4.5vw, 3.8rem)',
          { lineHeight: '1.07', letterSpacing: '-0.035em' },
        ],
        'display-lg': [
          'clamp(1.8rem, 3vw, 2.6rem)',
          { lineHeight: '1.15', letterSpacing: '-0.03em' },
        ],
        'display-md': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
      },

      boxShadow: {
        neonRed: '0 0 15px #F65A70',
        neonPink: '0 0 15px #FF94AE',
        neonCyan: '0 0 15px #86F0FD',
        neonGreen: '0 0 15px #CEFB7C',
        neonPurple: '0 0 15px #99A1FC',
        neonBlue: '0 0 15px #60AFFF',
        neonGrey: '0 0 15px #B0ADA7',

        // Column-level glows (border + ambient)
        'col-todo': '0 0 10px rgba(176,173,167,0.35), 0 0 24px rgba(176,173,167,0.12)',
        'col-progress': '0 0 10px rgba(96,175,255,0.40),  0 0 26px rgba(96,175,255,0.14)',
        'col-qa': '0 0 10px rgba(134,240,253,0.40), 0 0 26px rgba(134,240,253,0.14)',
        'col-done': '0 0 10px rgba(156,237,193,0.40), 0 0 26px rgba(156,237,193,0.14)',

        // Card-level glows (resting)
        'card-todo': '0 0 6px rgba(176,173,167,0.18), 0 2px 5px rgba(0,0,0,0.04)',
        'card-progress': '0 0 6px rgba(96,175,255,0.20),  0 2px 5px rgba(0,0,0,0.04)',
        'card-qa': '0 0 6px rgba(134,240,253,0.20), 0 2px 5px rgba(0,0,0,0.04)',
        'card-done': '0 0 6px rgba(156,237,193,0.20), 0 2px 5px rgba(0,0,0,0.04)',

        // Card hover glows
        'card-todo-hover': '0 0 16px rgba(176,173,167,0.45), 0 4px 14px rgba(0,0,0,0.06)',
        'card-progress-hover': '0 0 16px rgba(96,175,255,0.50),  0 4px 14px rgba(0,0,0,0.06)',
        'card-qa-hover': '0 0 16px rgba(134,240,253,0.50), 0 4px 14px rgba(0,0,0,0.06)',
        'card-done-hover': '0 0 16px rgba(156,237,193,0.50), 0 4px 14px rgba(0,0,0,0.06)',

        'green-glow': '0 8px 32px rgba(137,217,157,0.3)',
        'green-glow-lg': '0 14px 40px rgba(137,217,157,0.4)',
        card: '0 8px 32px rgba(0,0,0,0.08)',
        'card-lg': '0 20px 60px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)',
      },

      animation: {
        'float-orb': 'floatOrb 6s ease-in-out infinite',
        'float-orb-fast': 'floatOrb 4s ease-in-out infinite',
        'rotate-conic': 'rotateConic 12s linear infinite',
        'orbit-slow': 'orbitSpin 20s linear infinite',
        'orbit-slow-rev': 'orbitSpin 30s linear infinite reverse',
        'float-card': 'floatCard 5s ease-in-out infinite',
        'pulse-neon': 'pulseNeon 2.4s ease-in-out infinite',
        'pulse-neon-fast': 'pulseNeon 2s ease-in-out infinite',
        'fade-down': 'fadeDown 0.18s ease both',
        'loader-bounce': 'loaderBounce 0.58s alternate infinite ease',
        'loader-shadow': 'loaderShadow 0.58s alternate infinite ease',
        'gradient-shift': 'gradShift 12s ease infinite',
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
        pulseNeon: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        fadeDown: {
          from: { opacity: '0', transform: 'translateY(-6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        loaderBounce: {
          '0%': {
            transform: 'translateY(28px) scaleX(1.55) scaleY(0.55)',
            borderRadius: '9999px / 42%',
          },
          '40%': {
            transform: 'translateY(0px) scaleX(1) scaleY(1)',
            borderRadius: '9999px',
          },
          '100%': {
            transform: 'translateY(-28px) scaleX(1) scaleY(1)',
            borderRadius: '9999px',
          },
        },
        loaderShadow: {
          '0%': {
            transform: 'scaleX(1.45)',
            opacity: '0.3',
          },
          '40%': {
            transform: 'scaleX(1)',
            opacity: '0.18',
          },
          '100%': {
            transform: 'scaleX(0.38)',
            opacity: '0.08',
          },
        },
        gradShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '25%': { backgroundPosition: '25% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '75%': { backgroundPosition: '75% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [import('tailwindcss-animate')],
};
