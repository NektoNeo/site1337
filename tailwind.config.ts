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
  		colors: {
  			// ===== SEMANTIC COLORS (CSS Variables) =====
  			'bg': {
  				primary: 'var(--color-bg-primary)',
  				secondary: 'var(--color-bg-secondary)',
  				tertiary: 'var(--color-bg-tertiary)',
  				card: 'var(--color-bg-card)',
  				elevated: 'var(--color-bg-elevated)',
  			},
  			'text': {
  				primary: 'var(--color-text-primary)',
  				secondary: 'var(--color-text-secondary)',
  				muted: 'var(--color-text-muted)',
  				disabled: 'var(--color-text-disabled)',
  			},
  			'va-accent': {
  				DEFAULT: 'var(--color-accent-primary)',
  				primary: 'var(--color-accent-primary)',
  				secondary: 'var(--color-accent-secondary)',
  				glow: 'var(--color-accent-glow)',
  				bright: 'var(--color-accent-bright)',
  			},
  			'va-border': {
  				DEFAULT: 'var(--color-border-subtle)',
  				subtle: 'var(--color-border-subtle)',
  				glow: 'var(--color-border-glow)',
  			},

  			// ===== PURPLE PALETTE (Primary Accent) =====
  			'purple': {
  				'50': '#faf5ff',
  				'100': '#f3e8ff',
  				'200': '#e9d5ff',
  				'300': '#d8b4fe',
  				'400': '#c084fc',
  				'500': '#a855f7',
  				'600': '#9333ea',
  				'700': '#7c3aed',
  				'800': '#6b21a8',
  				'900': '#581c87',
  				'950': '#3b0764',
  			},

  			// ===== FUCHSIA PALETTE (Glow Accent) =====
  			'fuchsia': {
  				'50': '#fdf4ff',
  				'100': '#fae8ff',
  				'200': '#f5d0fe',
  				'300': '#f0abfc',
  				'400': '#e879f9',
  				'500': '#d946ef',
  				'600': '#c026d3',
  				'700': '#a21caf',
  				'800': '#86198f',
  				'900': '#701a75',
  				'950': '#4a044e',
  			},

  			// ===== UV GLOW COLORS (with opacity) =====
  			'uv': {
  				'5': 'rgba(168, 85, 247, 0.05)',
  				'10': 'rgba(168, 85, 247, 0.10)',
  				'15': 'rgba(168, 85, 247, 0.15)',
  				'20': 'rgba(168, 85, 247, 0.20)',
  				'30': 'rgba(168, 85, 247, 0.30)',
  				'40': 'rgba(168, 85, 247, 0.40)',
  				'50': 'rgba(168, 85, 247, 0.50)',
  			},

  			// ===== VOID BACKGROUNDS =====
  			void: {
  				black: '#0a0a0f',
  				dark: '#12121a',
  				medium: '#1a1a24',
  				light: '#252532',
  			},

  			// ===== GLASS EFFECTS =====
  			glass: {
  				border: 'var(--color-border-subtle)',
  				'border-hover': 'var(--color-border-glow)',
  				bg: 'var(--color-bg-card)',
  			},

  			// ===== LEGACY SUPPORT (deprecated) =====
  			'va-graphite': {
  				'50': '#f8f9fa',
  				'100': '#e9ecef',
  				'200': '#dee2e6',
  				'300': '#ced4da',
  				'400': '#adb5bd',
  				'500': '#6c757d',
  				'600': '#495057',
  				'700': '#343a40',
  				'800': '#212529',
  				'900': '#0a0a0a',
  				'950': '#000000'
  			},
  			'va-ultraviolet': {
  				'50': 'rgba(168, 85, 247, 0.05)',
  				'100': 'rgba(168, 85, 247, 0.1)',
  				'200': 'rgba(168, 85, 247, 0.15)',
  				'300': 'rgba(168, 85, 247, 0.2)',
  				'400': 'rgba(168, 85, 247, 0.25)',
  				'500': 'rgba(168, 85, 247, 0.3)',
  				'600': 'rgba(168, 85, 247, 0.4)',
  				'700': 'rgba(168, 85, 247, 0.5)',
  				'800': 'rgba(168, 85, 247, 0.6)',
  				'900': 'rgba(168, 85, 247, 0.7)'
  			},
  			'va-dark': {
  				'50': '#f8fafc',
  				'100': '#f1f5f9',
  				'200': '#e2e8f0',
  				'300': '#cbd5e1',
  				'400': '#94a3b8',
  				'500': '#64748b',
  				'600': '#475569',
  				'700': '#334155',
  				'800': '#1e293b',
  				'900': '#0f172a',
  				'950': '#0a0a0a'
  			},
  			neon: {
  				purple: 'rgba(168, 85, 247, 0.3)',
  				'purple-light': 'rgba(168, 85, 247, 0.15)',
  				'purple-strong': 'rgba(168, 85, 247, 0.5)',
  				fuchsia: 'rgba(217, 70, 239, 0.3)',
  				'fuchsia-light': 'rgba(217, 70, 239, 0.15)',
  				'fuchsia-strong': 'rgba(217, 70, 239, 0.5)',
  				// Legacy aliases
  				ultraviolet: 'rgba(168, 85, 247, 0.3)',
  				'ultraviolet-light': 'rgba(168, 85, 247, 0.15)',
  				'ultraviolet-strong': 'rgba(168, 85, 247, 0.5)'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			}
  		},
  		fontFamily: {
  			inter: [
  				'var(--font-inter)',
  				'Inter',
  				'system-ui',
  				'-apple-system',
  				'sans-serif'
  			],
  			sans: [
  				'var(--font-inter)',
  				'Inter',
  				'system-ui',
  				'-apple-system',
  				'sans-serif'
  			],
  			mono: [
  				'Consolas',
  				'Monaco',
  				'Courier New',
  				'monospace'
  			]
  		},
  		fontSize: {
  			'xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0' }],
  			'sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0' }],
  			'base': ['1rem', { lineHeight: '1.5', letterSpacing: '0' }],
  			'lg': ['1.125rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
  			'xl': ['1.25rem', { lineHeight: '1.35', letterSpacing: '-0.01em' }],
  			'2xl': ['1.5rem', { lineHeight: '1.35', letterSpacing: '-0.02em' }],
  			'3xl': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
  			'4xl': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
  			'5xl': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
  		},
  		boxShadow: {
  			// ===== UV GLOW SHADOWS (Purple #a855f7) =====
  			'uv-sm': '0 0 8px rgba(168, 85, 247, 0.15)',
  			'uv-md': '0 0 16px rgba(168, 85, 247, 0.25)',
  			'uv-lg': '0 0 24px rgba(168, 85, 247, 0.35)',
  			'uv-xl': '0 0 40px rgba(168, 85, 247, 0.45)',

  			// ===== FUCHSIA GLOW SHADOWS (#d946ef) =====
  			'fuchsia-sm': '0 0 8px rgba(217, 70, 239, 0.15)',
  			'fuchsia-md': '0 0 16px rgba(217, 70, 239, 0.25)',
  			'fuchsia-lg': '0 0 24px rgba(217, 70, 239, 0.35)',

  			// ===== GLASS SHADOWS =====
  			glass: '0 8px 32px rgba(0, 0, 0, 0.4)',
  			'glass-lg': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  			'glass-card': '0 4px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',

  			// ===== SEMANTIC GLOW (via CSS vars) =====
  			'glow-sm': '0 0 10px var(--glow-purple-sm)',
  			'glow-md': '0 0 20px var(--glow-purple-md)',
  			'glow-lg': '0 0 30px var(--glow-purple-lg)',
  			'glow-fuchsia-sm': '0 0 10px var(--glow-fuchsia-sm)',
  			'glow-fuchsia-md': '0 0 20px var(--glow-fuchsia-md)',

  			// ===== LEGACY ALIASES (deprecated) =====
  			'neon-purple': '0 0 8px rgba(168, 85, 247, 0.15)',
  			'neon-purple-sm': '0 0 4px rgba(168, 85, 247, 0.1)',
  			'neon-purple-lg': '0 0 12px rgba(168, 85, 247, 0.2)',
  			'neon-magenta': '0 0 8px rgba(217, 70, 239, 0.15)',
  			'neon-magenta-sm': '0 0 4px rgba(217, 70, 239, 0.1)',
  			'neon-magenta-lg': '0 0 12px rgba(217, 70, 239, 0.2)',
  			'neon-ultraviolet': '0 0 8px rgba(168, 85, 247, 0.15)',
  			'neon-ultraviolet-sm': '0 0 4px rgba(168, 85, 247, 0.1)',
  			'neon-ultraviolet-lg': '0 0 12px rgba(168, 85, 247, 0.2)',
  		},
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
  			// Minimal patterns - very subtle
  			'circuit-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
  			// No colorful gradients - grayscale only
  			'va-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
  			'va-gradient-reverse': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 100%)',
  			'va-gradient-vertical': 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
  			// Minimal mesh - subtle purple glow
  			'mesh-gradient': 'radial-gradient(at 40% 20%, rgba(168, 85, 247, 0.05) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(217, 70, 239, 0.03) 0px, transparent 50%)',
  			'mesh-gradient-strong': 'radial-gradient(at 40% 20%, rgba(168, 85, 247, 0.12) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(217, 70, 239, 0.08) 0px, transparent 50%)',
  			'grid-pattern': 'linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)'
  		},
  		animation: {
  			'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
  			'pulse-glow-fuchsia': 'pulse-glow-fuchsia 2s ease-in-out infinite',
  			glow: 'glow 2s ease-in-out infinite alternate',
  			'glow-slow': 'glow 4s ease-in-out infinite alternate',
  			'neon-flicker-fuchsia': 'neon-flicker-fuchsia 1.5s infinite alternate',
  			float: 'float 6s ease-in-out infinite',
  			'float-slow': 'float 8s ease-in-out infinite',
  			'gradient-shift': 'gradient-shift 8s ease infinite',
  			'gradient-x': 'gradient-x 15s ease infinite',
  			'scan-line': 'scan-line 0.4s ease-out forwards',
  			'slide-in-right': 'slide-in-right 0.3s ease-out forwards',
  			'slide-out-right': 'slide-out-right 0.3s ease-in forwards',
  			'slide-in-up': 'slide-in-up 0.3s ease-out forwards',
  			'slide-in-down': 'slide-in-down 0.3s ease-out forwards',
  			'fade-in': 'fade-in 0.3s ease-out forwards',
  			'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
  			'scale-in': 'scale-in 0.2s ease-out forwards',
  			glitch: 'glitch 0.3s ease-out',
  			shimmer: 'shimmer 2s linear infinite',
  			'border-rotate': 'border-rotate 4s linear infinite',
  			'rgb-spin': 'rgb-spin 4s linear infinite',
  			'rgb-cycle': 'rgb-cycle 3s linear infinite',
  			'spin-slow': 'spin 3s linear infinite',
  			'neon-flicker': 'neon-flicker 1.5s infinite alternate',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		keyframes: {
  			'pulse-glow': {
  				'0%, 100%': {
  					boxShadow: '0 0 10px rgba(168, 85, 247, 0.5), 0 0 20px rgba(168, 85, 247, 0.3)'
  				},
  				'50%': {
  					boxShadow: '0 0 20px rgba(168, 85, 247, 0.8), 0 0 40px rgba(168, 85, 247, 0.5)'
  				}
  			},
  			'pulse-glow-fuchsia': {
  				'0%, 100%': {
  					boxShadow: '0 0 10px rgba(217, 70, 239, 0.5), 0 0 20px rgba(217, 70, 239, 0.3)'
  				},
  				'50%': {
  					boxShadow: '0 0 20px rgba(217, 70, 239, 0.8), 0 0 40px rgba(217, 70, 239, 0.5)'
  				}
  			},
  			glow: {
  				'0%': {
  					boxShadow: '0 0 5px rgba(168, 85, 247, 0.5), 0 0 20px rgba(168, 85, 247, 0.3)'
  				},
  				'100%': {
  					boxShadow: '0 0 20px rgba(168, 85, 247, 0.8), 0 0 40px rgba(168, 85, 247, 0.5)'
  				}
  			},
  			float: {
  				'0%, 100%': {
  					transform: 'translateY(0px)'
  				},
  				'50%': {
  					transform: 'translateY(-20px)'
  				}
  			},
  			'gradient-shift': {
  				'0%': {
  					backgroundPosition: '0% 50%'
  				},
  				'50%': {
  					backgroundPosition: '100% 50%'
  				},
  				'100%': {
  					backgroundPosition: '0% 50%'
  				}
  			},
  			'gradient-x': {
  				'0%, 100%': {
  					backgroundSize: '200% 200%',
  					backgroundPosition: 'left center'
  				},
  				'50%': {
  					backgroundSize: '200% 200%',
  					backgroundPosition: 'right center'
  				}
  			},
  			'scan-line': {
  				'0%': {
  					width: '0%',
  					left: '0%'
  				},
  				'100%': {
  					width: '100%',
  					left: '0%'
  				}
  			},
  			'slide-in-right': {
  				'0%': {
  					transform: 'translateX(100%)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateX(0)',
  					opacity: '1'
  				}
  			},
  			'slide-out-right': {
  				'0%': {
  					transform: 'translateX(0)',
  					opacity: '1'
  				},
  				'100%': {
  					transform: 'translateX(100%)',
  					opacity: '0'
  				}
  			},
  			'slide-in-up': {
  				'0%': {
  					transform: 'translateY(20px)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateY(0)',
  					opacity: '1'
  				}
  			},
  			'slide-in-down': {
  				'0%': {
  					transform: 'translateY(-20px)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateY(0)',
  					opacity: '1'
  				}
  			},
  			'fade-in': {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			'fade-in-up': {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(20px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			'scale-in': {
  				'0%': {
  					opacity: '0',
  					transform: 'scale(0.9)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'scale(1)'
  				}
  			},
  			glitch: {
  				'0%': {
  					transform: 'translate(0)'
  				},
  				'20%': {
  					transform: 'translate(-2px, 2px)'
  				},
  				'40%': {
  					transform: 'translate(-2px, -2px)'
  				},
  				'60%': {
  					transform: 'translate(2px, 2px)'
  				},
  				'80%': {
  					transform: 'translate(2px, -2px)'
  				},
  				'100%': {
  					transform: 'translate(0)'
  				}
  			},
  			shimmer: {
  				'0%': {
  					backgroundPosition: '-200% 0'
  				},
  				'100%': {
  					backgroundPosition: '200% 0'
  				}
  			},
  			'border-rotate': {
  				'0%': {
  					transform: 'rotate(0deg)'
  				},
  				'100%': {
  					transform: 'rotate(360deg)'
  				}
  			},
  			'rgb-spin': {
  				'0%': {
  					transform: 'rotate(0deg)'
  				},
  				'100%': {
  					transform: 'rotate(360deg)'
  				}
  			},
  			'rgb-cycle': {
  				'0%': {
  					filter: 'hue-rotate(0deg)'
  				},
  				'100%': {
  					filter: 'hue-rotate(360deg)'
  				}
  			},
  			'neon-flicker': {
  				'0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': {
  					textShadow: '0 0 4px #fff, 0 0 11px #fff, 0 0 19px #fff, 0 0 40px #a855f7, 0 0 80px #a855f7'
  				},
  				'20%, 24%, 55%': {
  					textShadow: 'none'
  				}
  			},
  			'neon-flicker-fuchsia': {
  				'0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': {
  					textShadow: '0 0 4px #fff, 0 0 11px #fff, 0 0 19px #fff, 0 0 40px #d946ef, 0 0 80px #d946ef'
  				},
  				'20%, 24%, 55%': {
  					textShadow: 'none'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		backdropBlur: {
  			xs: '2px',
  			'2xl': '40px',
  			'3xl': '64px'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			'4xl': '2rem',
  			'5xl': '2.5rem'
  		},
  		spacing: {
  			'18': '4.5rem',
  			'88': '22rem',
  			'128': '32rem',
  			'144': '36rem'
  		},
  		screens: {
  			xs: '475px',
  			'3xl': '1920px',
  			'4xl': '2560px'
  		},
  		transitionDuration: {
  			'400': '400ms',
  			'600': '600ms',
  			'800': '800ms',
  			'1200': '1200ms',
  			'2000': '2000ms'
  		},
  		zIndex: {
  			'60': '60',
  			'70': '70',
  			'80': '80',
  			'90': '90',
  			'100': '100'
  		}
  	}
  },
  plugins: [],
};

export default config;
