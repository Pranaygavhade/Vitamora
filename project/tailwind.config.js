/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary deep-forest-green scale
        forest: {
          50:  '#eef4f0',
          100: '#d4e6d8',
          200: '#a9cdb2',
          300: '#7db48b',
          400: '#4d9063',
          500: '#2d6b45',
          600: '#1e5234',
          700: '#143d26',
          800: '#0e2c1c',
          900: '#0B2E1A',   // deep forest — main bg
          950: '#071810',
        },
        // Emerald accent
        emerald: {
          300: '#6ee7b7',
          400: '#34d399',
          500: '#167A45',   // brand emerald
          600: '#0f5c34',
          700: '#0a4228',
        },
        // Sage / muted green
        sage: {
          100: '#e8f0e6',
          200: '#d0e2cc',
          300: '#A8C7A0',   // sage green
          400: '#85ad7b',
          500: '#6F7D3A',   // olive
          600: '#5a6830',
        },
        // Gold accent
        gold: {
          100: '#f7f0dc',
          200: '#eedd9e',
          300: '#dcc063',
          400: '#C9A45C',   // warm muted gold
          500: '#b08a3e',
          600: '#906e2a',
        },
        // Cream / off-white text
        cream: {
          50:  '#fdfcf8',
          100: '#F7F3E8',   // main off-white text
          200: '#ede6cf',
          300: '#dfd5b5',
          400: '#c8b98a',
          500: '#b09a65',
        },
        // Secondary muted green text
        mist: {
          100: '#dce8d8',
          200: '#B6C8B3',   // secondary muted green text
          300: '#94aa90',
          400: '#728c6e',
          500: '#546851',
        },
        // Charcoal dark-green surfaces
        dark: {
          50:  '#1a2e20',
          100: '#152518',
          200: '#112010',
          300: '#10261B',   // dark charcoal-green
          400: '#0d1f15',
          500: '#0a1810',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:  ['"DM Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono:  ['"DM Mono"', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },
      backgroundImage: {
        'glass-forest':   'linear-gradient(135deg, rgba(11,46,26,0.85) 0%, rgba(16,38,27,0.90) 100%)',
        'glass-emerald':  'linear-gradient(135deg, rgba(22,122,69,0.18) 0%, rgba(11,46,26,0.30) 100%)',
        'glass-card':     'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
        'hero-gradient':  'linear-gradient(135deg, #0B2E1A 0%, #10261B 40%, #143d26 100%)',
        'gold-shimmer':   'linear-gradient(90deg, transparent 0%, rgba(201,164,92,0.3) 50%, transparent 100%)',
      },
      boxShadow: {
        'glass':       '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)',
        'glass-lg':    '0 16px 48px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.10)',
        'glass-glow':  '0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(22,122,69,0.20), inset 0 1px 0 rgba(255,255,255,0.08)',
        'gold-glow':   '0 4px 20px rgba(201,164,92,0.30)',
        'gold-glow-lg':'0 8px 40px rgba(201,164,92,0.45)',
        'green-glow':  '0 4px 20px rgba(22,122,69,0.35)',
        'green-glow-lg':'0 8px 40px rgba(22,122,69,0.45)',
        'inner-light': 'inset 0 1px 0 rgba(255,255,255,0.10)',
      },
      borderColor: {
        glass:        'rgba(255,255,255,0.08)',
        'glass-md':   'rgba(255,255,255,0.12)',
        'glass-lg':   'rgba(255,255,255,0.18)',
        'green-dim':  'rgba(22,122,69,0.25)',
        'green-mid':  'rgba(22,122,69,0.40)',
        'gold-dim':   'rgba(201,164,92,0.25)',
        'gold-mid':   'rgba(201,164,92,0.45)',
      },
      animation: {
        // entrance
        'fade-up':         'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) forwards',
        'fade-in':         'fadeIn 0.5s ease-out forwards',
        'scale-in':        'scaleIn 0.4s cubic-bezier(0.22,1,0.36,1) forwards',
        'slide-left':      'slideFromLeft 0.7s cubic-bezier(0.22,1,0.36,1) forwards',
        // navbar
        'navbar-enter':    'navbarSlideDown 0.7s cubic-bezier(0.22,1,0.36,1) forwards',
        'nav-item':        'navItemFadeIn 0.5s cubic-bezier(0.22,1,0.36,1) forwards',
        'mobile-open':     'mobileMenuReveal 0.45s cubic-bezier(0.22,1,0.36,1) forwards',
        'mobile-close':    'mobileMenuHide 0.35s cubic-bezier(0.55,0,0.45,1) forwards',
        'nav-float':       'navFloat 5s ease-in-out infinite',
        // ambient
        'float':           'float 6s ease-in-out infinite',
        'float-slow':      'float 10s ease-in-out infinite',
        'pulse-gold':      'pulseGold 3s ease-in-out infinite',
        'shimmer':         'shimmer 2.5s linear infinite',
        'leaf-drift':      'leafDrift 8s ease-in-out infinite',
        'glow-pulse':      'glowPulse 3s ease-in-out infinite',
        // hero
        'hero-text':       'heroText 0.8s cubic-bezier(0.22,1,0.36,1) forwards',
        'hero-badge':      'heroBadge 0.6s cubic-bezier(0.22,1,0.36,1) forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideFromLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-32px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        navbarSlideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-28px) scaleX(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scaleX(1)' },
        },
        navItemFadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        mobileMenuReveal: {
          '0%':   { clipPath: 'inset(0 0 100% 0 round 20px)', opacity: '0' },
          '100%': { clipPath: 'inset(0 0 0% 0 round 20px)',   opacity: '1' },
        },
        mobileMenuHide: {
          '0%':   { clipPath: 'inset(0 0 0% 0 round 20px)',   opacity: '1' },
          '100%': { clipPath: 'inset(0 0 100% 0 round 20px)', opacity: '0' },
        },
        navFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-2px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '0.6' },
          '50%':      { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        leafDrift: {
          '0%, 100%': { transform: 'translateY(0) rotate(-3deg)' },
          '33%':      { transform: 'translateY(-8px) rotate(3deg)' },
          '66%':      { transform: 'translateY(4px) rotate(-1deg)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(22,122,69,0.20)' },
          '50%':      { boxShadow: '0 0 30px rgba(22,122,69,0.40)' },
        },
        heroText: {
          '0%':   { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        heroBadge: {
          '0%':   { opacity: '0', transform: 'translateY(12px) scale(0.90)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.22, 1, 0.36, 1)',
        snap:   'cubic-bezier(0.55, 0, 0.45, 1)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      backdropBlur: {
        xs: '2px',
        '4xl': '64px',
      },
    },
  },
  plugins: [],
};
