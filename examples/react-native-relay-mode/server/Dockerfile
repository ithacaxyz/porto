# syntax=docker/dockerfile:1
FROM oven/bun AS build

WORKDIR /app

ENV NODE_ENV="production"

COPY index.ts .

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
