import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ============================================
      // VA-PC CUSTOM COLORS
      // ============================================
      colors: {
        // Primary Purple Palette
        "va-purple": {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#8B5CF6", // Primary brand color
          800: "#6b21a8",
          900: "#581c87",
          950: "#3b0764",
        },
        // Accent Cyan/Teal Palette
        "va-cyan": {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22D3EE", // Bright accent
          500: "#06B6D4", // Main cyan
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
          950: "#083344",
        },
        // Dark Background Palette
        "va-dark": {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#0a0a0a",
        },
        // Neon Circuitry Palette (legacy support)
        neon: {
          purple: "#8B5CF6",
          "purple-dark": "#7C3AED",
          "purple-light": "#A78BFA",
          cyan: "#06B6D4",
          "cyan-dark": "#0891B2",
          "cyan-light": "#22D3EE",
        },
        void: {
          black: "#0A0A0F",
          dark: "#111118",
          medium: "#1A1A24",
          light: "#252532",
        },
        glass: {
          border: "rgba(139, 92, 246, 0.2)",
          "border-hover": "rgba(139, 92, 246, 0.4)",
          bg: "rgba(17, 17, 24, 0.8)",
        },
        // Semantic Colors for shadcn/ui compatibility
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },

      // ============================================
      // CUSTOM FONTS
      // ============================================
      fontFamily: {
        orbitron: ["var(--font-orbitron)", "Orbitron", "sans-serif"],
        outfit: ["var(--font-outfit)", "Outfit", "sans-serif"],
        display: ["Rajdhani", "sans-serif"],
        body: ["IBM Plex Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },

      // ============================================
      // BOX SHADOWS
      // ============================================
      boxShadow: {
        // Neon glow shadows
        "neon-purple":
          "0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.3)",
        "neon-purple-sm":
          "0 0 10px rgba(139, 92, 246, 0.4), 0 0 20px rgba(139, 92, 246, 0.2)",
        "neon-purple-lg":
          "0 0 30px rgba(139, 92, 246, 0.6), 0 0 60px rgba(139, 92, 246, 0.4)",
        "neon-cyan":
          "0 0 20px rgba(6, 182, 212, 0.5), 0 0 40px rgba(6, 182, 212, 0.3)",
        "neon-cyan-sm":
          "0 0 10px rgba(6, 182, 212, 0.4), 0 0 20px rgba(6, 182, 212, 0.2)",
        "neon-cyan-lg":
          "0 0 30px rgba(6, 182, 212, 0.6), 0 0 60px rgba(6, 182, 212, 0.4)",
        "neon-multi":
          "0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(6, 182, 212, 0.3)",
        // Glass shadows
        glass: "0 8px 32px rgba(0, 0, 0, 0.4)",
        "glass-lg": "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        // Glow shadows
        "glow-sm": "0 0 10px rgba(139, 92, 246, 0.3)",
        "glow-md": "0 0 20px rgba(139, 92, 246, 0.4)",
        "glow-lg": "0 0 30px rgba(139, 92, 246, 0.5)",
      },

      // ============================================
      // BACKGROUND IMAGES
      // ============================================
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "circuit-pattern": `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B5CF6' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        // VA-PC Brand gradients
        "va-gradient": "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)",
        "va-gradient-reverse":
          "linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)",
        "va-gradient-vertical":
          "linear-gradient(180deg, #8B5CF6 0%, #06B6D4 100%)",
        // Mesh gradient
        "mesh-gradient": `
          radial-gradient(at 40% 20%, rgba(139, 92, 246, 0.3) 0px, transparent 50%),
          radial-gradient(at 80% 0%, rgba(6, 182, 212, 0.2) 0px, transparent 50%),
          radial-gradient(at 0% 50%, rgba(139, 92, 246, 0.2) 0px, transparent 50%),
          radial-gradient(at 80% 50%, rgba(6, 182, 212, 0.15) 0px, transparent 50%)
        `,
        // Grid pattern
        "grid-pattern": `
          linear-gradient(to right, rgba(139, 92, 246, 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
        `,
      },

      // ============================================
      // ANIMATIONS
      // ============================================
      animation: {
        // Glow effects
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "glow-slow": "glow 4s ease-in-out infinite alternate",
        // Movement animations
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        // Gradient animations
        "gradient-shift": "gradient-shift 8s ease infinite",
        "gradient-x": "gradient-x 15s ease infinite",
        // UI animations
        "scan-line": "scan-line 0.4s ease-out forwards",
        "slide-in-right": "slide-in-right 0.3s ease-out forwards",
        "slide-out-right": "slide-out-right 0.3s ease-in forwards",
        "slide-in-up": "slide-in-up 0.3s ease-out forwards",
        "slide-in-down": "slide-in-down 0.3s ease-out forwards",
        "fade-in": "fade-in 0.3s ease-out forwards",
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
        "scale-in": "scale-in 0.2s ease-out forwards",
        glitch: "glitch 0.3s ease-out",
        // Shimmer effect
        shimmer: "shimmer 2s linear infinite",
        // Border rotation
        "border-rotate": "border-rotate 4s linear infinite",
        "rgb-spin": "rgb-spin 4s linear infinite",
        // RGB cycling
        "rgb-cycle": "rgb-cycle 3s linear infinite",
        // Spin slow
        "spin-slow": "spin 3s linear infinite",
        // Neon flicker
        "neon-flicker": "neon-flicker 1.5s infinite alternate",
      },

      // ============================================
      // KEYFRAMES
      // ============================================
      keyframes: {
        "pulse-glow": {
          "0%, 100%": {
            boxShadow:
              "0 0 10px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3)",
          },
          "50%": {
            boxShadow:
              "0 0 20px rgba(139, 92, 246, 0.8), 0 0 40px rgba(139, 92, 246, 0.5)",
          },
        },
        glow: {
          "0%": {
            boxShadow:
              "0 0 5px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3)",
          },
          "100%": {
            boxShadow:
              "0 0 20px rgba(139, 92, 246, 0.8), 0 0 40px rgba(139, 92, 246, 0.5)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "gradient-x": {
          "0%, 100%": {
            backgroundSize: "200% 200%",
            backgroundPosition: "left center",
          },
          "50%": {
            backgroundSize: "200% 200%",
            backgroundPosition: "right center",
          },
        },
        "scan-line": {
          "0%": { width: "0%", left: "0%" },
          "100%": { width: "100%", left: "0%" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-out-right": {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        "slide-in-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in-down": {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        glitch: {
          "0%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
          "100%": { transform: "translate(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "border-rotate": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "rgb-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "rgb-cycle": {
          "0%": { filter: "hue-rotate(0deg)" },
          "100%": { filter: "hue-rotate(360deg)" },
        },
        "neon-flicker": {
          "0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%": {
            textShadow: `
              0 0 4px #fff,
              0 0 11px #fff,
              0 0 19px #fff,
              0 0 40px #8B5CF6,
              0 0 80px #8B5CF6
            `,
          },
          "20%, 24%, 55%": {
            textShadow: "none",
          },
        },
      },

      // ============================================
      // BACKDROP BLUR
      // ============================================
      backdropBlur: {
        xs: "2px",
        "2xl": "40px",
        "3xl": "64px",
      },

      // ============================================
      // BORDER RADIUS
      // ============================================
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      // ============================================
      // SPACING
      // ============================================
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
        "144": "36rem",
      },

      // ============================================
      // SCREENS
      // ============================================
      screens: {
        xs: "475px",
        "3xl": "1920px",
        "4xl": "2560px",
      },

      // ============================================
      // TRANSITION DURATION
      // ============================================
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
        "1200": "1200ms",
        "2000": "2000ms",
      },

      // ============================================
      // Z-INDEX
      // ============================================
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
    },
  },
  plugins: [],
};

export default config;
