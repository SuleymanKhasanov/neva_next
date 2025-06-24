# Dockerfile
FROM node:18-alpine AS base

# Установка зависимостей для Sharp
RUN apk add --no-cache \
    libc6-compat \
    vips-dev \
    python3 \
    make \
    g++

WORKDIR /app

# Копируем package.json и yarn.lock
COPY package.json yarn.lock* ./

# Установка зависимостей
FROM base AS deps
RUN yarn install --frozen-lockfile

# Этап сборки
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Отключаем телеметрию Next.js
ENV NEXT_TELEMETRY_DISABLED 1

# Создаем директории для статических файлов
RUN mkdir -p ./public/optimized

# Сборка приложения
RUN yarn build

# Продакшен образ
FROM node:18-alpine AS runner
WORKDIR /app

# Установка vips для Sharp в runtime
RUN apk add --no-cache \
    libc6-compat \
    vips

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Создание пользователя nextjs
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем файлы
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Копируем собранное приложение
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]