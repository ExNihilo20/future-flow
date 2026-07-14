FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG API_BASE_URL=http://localhost:3000/api/v1
RUN sed -i "s|apiBaseUrl: '.*'|apiBaseUrl: '${API_BASE_URL}'|" src/environments/environment.prod.ts \
  && sed -i "s|apiBaseUrl: '.*'|apiBaseUrl: '${API_BASE_URL}'|" src/environments/environment.ts \
  && npm run build -- --configuration=production

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/web/browser /usr/share/nginx/html
EXPOSE 80
