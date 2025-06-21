# Stage 1: Build React app
FROM node:22-alpine AS builder
WORKDIR /app

# Copy source
COPY package*.json ./
COPY . .

COPY .env .env
RUN npm install && npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
