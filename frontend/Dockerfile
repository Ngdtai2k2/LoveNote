
FROM node:22-alpine AS development
WORKDIR /app

COPY package*.json ./
RUN npm install

EXPOSE 3000
CMD ["npm", "run", "start"]

# Stage 2: Production
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

# Stage 3: Serve production build
FROM nginx:alpine AS production
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
