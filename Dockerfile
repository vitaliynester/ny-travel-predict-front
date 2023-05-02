FROM node:18-alpine as build
WORKDIR /app
COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
RUN npm install --only=prod
COPY . /app
RUN npm run build

FROM nginx:1.23-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
