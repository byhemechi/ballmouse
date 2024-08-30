# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=16.20.2
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"
ARG YARN_VERSION=1.22.22
RUN npm install -g yarn@$YARN_VERSION --force


# Throw-away build stage to reduce size of final image
FROM --platform=x86_64 base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config

# Install node modules
COPY --link package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

# Copy application code
COPY --link . .

# Build application
ENV NODE_ENV=production
RUN yarn run build


# Final stage for app image
FROM nginx:alpine

WORKDIR /usr/share/nginx/html
COPY --from=build /app/index.html .
COPY --from=build /app/menu.* .
COPY --from=build /app/dist dist
COPY --from=build /app/assets assets
