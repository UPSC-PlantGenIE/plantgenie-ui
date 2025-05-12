FROM rust:1.86.0-slim-bookworm AS wasm-builder

# Install dependencies for wasm-pack and potential build scripts
# build-essential is the Debian equivalent of build-base
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

RUN cargo install wasm-pack

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
