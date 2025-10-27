# syntax=docker/dockerfile:1
# check=experimental=all
FROM oven/bun AS build

WORKDIR /app

# Cache packages installation
COPY package.json package.json
COPY bun.lock bun.lock

RUN bun install

COPY index.ts .

ENV NODE_ENV="production"

RUN bun build \
  --compile \
  --target bun \
  --minify-syntax \
  --minify-whitespace \
  --outfile server \
  ./index.ts

FROM gcr.io/distroless/base

ARG PORT
ENV PORT=$PORT

WORKDIR /app

COPY --from=build /app/server server
COPY apple-app-site-association assetlinks.json /app/

ENV NODE_ENV="production"

CMD ["./server"]

EXPOSE $PORT
