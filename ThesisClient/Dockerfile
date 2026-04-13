# ── 1. Build stage ──────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

# package.json másolása először → cache a node_modules-hoz
COPY package*.json ./
RUN npm ci --prefer-offline

# Forrás másolása és build
COPY . .
RUN npm run build
# Vite kimenete: /app/dist  |  CRA kimenete: /app/build

# ── 2. Runtime stage (Nginx) ─────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

# Egyedi Nginx konfig (API proxy + SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Build artifact másolása
COPY --from=build /app/dist /usr/share/nginx/html
# Ha CRA-t használsz: /app/build helyett

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
