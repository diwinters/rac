# Build stage
FROM node:20.11-alpine3.18 AS build

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy source
COPY . .

# Build TypeScript
RUN npm run build

# Prune dev dependencies
RUN npm prune --production

# Production stage
FROM node:20.11-alpine3.18

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

ENTRYPOINT ["dumb-init", "--"]

WORKDIR /app

# Create data directory
RUN mkdir -p /app/data

# Copy built files and production dependencies
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./

# Set environment
ENV NODE_ENV=production
ENV DATA_DIR=/app/data
ENV PORT=3001

# Run as non-root user
USER node

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

CMD ["node", "dist/index.js"]
