# FROM node:24-alpine AS development-dependencies-env
# COPY . /app
# WORKDIR /app
# RUN npm ci

# FROM node:24-alpine AS production-dependencies-env
# COPY ./package.json package-lock.json /app/
# WORKDIR /app
# RUN npm ci --omit=dev

# FROM node:24-alpine AS build-env
# COPY . /app/
# COPY --from=development-dependencies-env /app/node_modules /app/node_modules
# WORKDIR /app
# RUN npm run build

# FROM node:24-alpine
# COPY ./package.json package-lock.json /app/
# COPY --from=production-dependencies-env /app/node_modules /app/node_modules
# COPY --from=build-env /app/build /app/build
# WORKDIR /app
# CMD ["npm", "run", "start"]

FROM node:24-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:24-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM node:24-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app

# Variáveis do Vite precisam existir DURANTE o build (ele grava os valores no código).
# O Render repassa as variáveis do painel como build args com estes mesmos nomes.
ARG VITE_API_HOST
ARG VITE_API_HTTPS
ARG VITE_API_PATH
ENV VITE_API_HOST=$VITE_API_HOST
ENV VITE_API_HTTPS=$VITE_API_HTTPS
ENV VITE_API_PATH=$VITE_API_PATH

RUN npm run build

FROM node:24-alpine
COPY ./package.json package-lock.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
CMD ["npm", "run", "start"]
