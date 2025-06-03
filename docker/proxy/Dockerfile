FROM oven/bun:latest

COPY docker/proxy .

EXPOSE 9200
ENTRYPOINT ["bun", "run", "index.ts"]
