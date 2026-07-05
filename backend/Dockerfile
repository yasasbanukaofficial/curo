FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm

RUN addgroup app && adduser -S -G app app

COPY package.json pnpm-lock.yaml ./

RUN chown app:app .

USER app

RUN pnpm install --frozen-lockfile --prod

COPY . .

EXPOSE 8000

CMD ["node", "dist/index.js"]