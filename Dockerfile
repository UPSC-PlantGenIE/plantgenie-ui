FROM node:22.12.0-alpine AS frontend-builder

WORKDIR /app

# Copy only package files to leverage Docker cache
COPY package.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./

# Install dependencies and build the frontend
RUN yarn install
COPY ./ ./
RUN yarn build
