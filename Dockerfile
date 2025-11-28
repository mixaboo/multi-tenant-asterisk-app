FROM node:22-alpine

RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    py3-pip


WORKDIR /opt/app
COPY package*.json ./
RUN npm ci --production=false && npm cache clean --force
RUN npm install
COPY . .

RUN npm run build
RUN npm prune --production
CMD ["node", "./dist/main.js"]
