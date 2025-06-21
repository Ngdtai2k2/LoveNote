FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

RUN chmod +x scripts/entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["sh", "./scripts/entrypoint.sh"]
CMD ["node", "src/server.js"]
