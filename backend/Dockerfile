### Stage 1: Development
FROM node:22-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

RUN npm install -g nodemon

COPY . .

RUN chmod +x scripts/entrypoint.sh

EXPOSE 8000

CMD ["npm", "run", "dev"]

### Stage 2: Production
FROM node:22-alpine AS production

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

RUN chmod +x scripts/entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["sh", "./scripts/entrypoint.sh"]
CMD ["node", "src/server.js"]
