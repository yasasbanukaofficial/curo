FROM node:22-alpine AS build
WORKDIR /app

RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build


FROM node:22-alpine
WORKDIR /app

RUN npm install -g pnpm
RUN addgroup app && adduser -S -G app app

COPY package.json pnpm-lock.yaml ./
RUN chown app:app .

USER app

RUN pnpm install --frozen-lockfile --prod

COPY --from=build --chown=app:app /app/dist ./dist

EXPOSE 8000

CMD ["node", "dist/index.js"]