FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apk update
RUN apk add git

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm --filter manager --filter dialog build

FROM base AS manager
COPY --from=build /usr/src/app/apps/manager/dist /apps/manager
WORKDIR /apps/manager
RUN pnpm add -g serve
EXPOSE 8000
CMD [ "serve", "/apps/manager", "-l", "8000" ]

FROM base AS dialog
COPY --from=build /usr/src/app/apps/dialog/dist /apps/dialog
WORKDIR /apps/dialog
RUN pnpm add -g serve
EXPOSE 8001
CMD [ "serve", "/apps/dialog", "-l", "8001" ]