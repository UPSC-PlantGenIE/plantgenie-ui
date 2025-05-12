FROM rust:1.86.0-alpine3.21 AS wasm-builder

RUN apk add --no-cache curl \
    && curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh -s -- -y \
    && apk del curl

WORKDIR /usr/src/app

COPY ./crust ./crust

WORKDIR /usr/src/app/crust

RUN wasm-pack build --target web --out-dir pkg --release

FROM node:22.15.0-alpine AS frontend-builder

WORKDIR /app

# Copy only package files to leverage Docker cache
COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY vite.config.ts ./

# Install dependencies and build the frontend
RUN yarn install --frozen-lockfile
COPY ./ ./

COPY --from=wasm-builder /usr/src/app/crust/pkg /app/src/wasm

RUN yarn build
