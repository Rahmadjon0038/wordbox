FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=production
ENV PORT=5002
ENV CLIENT_ORIGIN=http://localhost:5000

EXPOSE 5002

CMD ["node", "server.js"]
