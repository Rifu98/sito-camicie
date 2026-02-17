FROM node:20-alpine as build
WORKDIR /app
COPY package.json package-lock.json* ./
COPY src ./src
RUN npm ci && npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist/frontend /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
