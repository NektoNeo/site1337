# ============================================
# VA-PC Next.js Production Dockerfile
# Multi-stage build for optimized image size
# ============================================

# Stage 1: Dependencies
# Install only production dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
# Use --omit=dev for production (no devDependencies needed at runtime)
RUN npm ci --omit=dev

# ============================================
# Stage 2: Builder
# Build the Next.js application
# ============================================
FROM node:20-alpine AS builder
WORKDIR /app

# Copy all dependencies (including dev for build)
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Install dev dependencies for build
RUN npm ci

# Generate Prisma client if needed
# RUN npx prisma generate

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the application
# Creates standalone output in .next/standalone
RUN npm run build

# ============================================
# Stage 3: Runner
# Minimal production image
# ============================================
FROM node:20-alpine AS runner
WORKDIR /app

# Security: Run as non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy only necessary files from builder
# 1. Public assets
COPY --from=builder /app/public ./public

# 2. Standalone server and dependencies
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))" || exit 1

# Start the application
# Using standalone server.js (no need for node_modules)
CMD ["node", "server.js"]
