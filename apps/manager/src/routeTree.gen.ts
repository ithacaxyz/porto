/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as PlaygroundImport } from './routes/playground'
import { Route as LayoutImport } from './routes/_layout'
import { Route as LayoutIndexImport } from './routes/_layout.index'
import { Route as LayoutRecoveryImport } from './routes/_layout.recovery'
import { Route as LayoutAboutImport } from './routes/_layout.about'

// Create/Update Routes

const PlaygroundRoute = PlaygroundImport.update({
  id: '/playground',
  path: '/playground',
  getParentRoute: () => rootRoute,
} as any)

const LayoutRoute = LayoutImport.update({
  id: '/_layout',
  getParentRoute: () => rootRoute,
} as any)

const LayoutIndexRoute = LayoutIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutRecoveryRoute = LayoutRecoveryImport.update({
  id: '/recovery',
  path: '/recovery',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutAboutRoute = LayoutAboutImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => LayoutRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_layout': {
      id: '/_layout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof LayoutImport
      parentRoute: typeof rootRoute
    }
    '/playground': {
      id: '/playground'
      path: '/playground'
      fullPath: '/playground'
      preLoaderRoute: typeof PlaygroundImport
      parentRoute: typeof rootRoute
    }
    '/_layout/about': {
      id: '/_layout/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof LayoutAboutImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/recovery': {
      id: '/_layout/recovery'
      path: '/recovery'
      fullPath: '/recovery'
      preLoaderRoute: typeof LayoutRecoveryImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/': {
      id: '/_layout/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof LayoutIndexImport
      parentRoute: typeof LayoutImport
    }
  }
}

// Create and export the route tree

interface LayoutRouteChildren {
  LayoutAboutRoute: typeof LayoutAboutRoute
  LayoutRecoveryRoute: typeof LayoutRecoveryRoute
  LayoutIndexRoute: typeof LayoutIndexRoute
}

const LayoutRouteChildren: LayoutRouteChildren = {
  LayoutAboutRoute: LayoutAboutRoute,
  LayoutRecoveryRoute: LayoutRecoveryRoute,
  LayoutIndexRoute: LayoutIndexRoute,
}

const LayoutRouteWithChildren =
  LayoutRoute._addFileChildren(LayoutRouteChildren)

export interface FileRoutesByFullPath {
  '': typeof LayoutRouteWithChildren
  '/playground': typeof PlaygroundRoute
  '/about': typeof LayoutAboutRoute
  '/recovery': typeof LayoutRecoveryRoute
  '/': typeof LayoutIndexRoute
}

export interface FileRoutesByTo {
  '/playground': typeof PlaygroundRoute
  '/about': typeof LayoutAboutRoute
  '/recovery': typeof LayoutRecoveryRoute
  '/': typeof LayoutIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_layout': typeof LayoutRouteWithChildren
  '/playground': typeof PlaygroundRoute
  '/_layout/about': typeof LayoutAboutRoute
  '/_layout/recovery': typeof LayoutRecoveryRoute
  '/_layout/': typeof LayoutIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '' | '/playground' | '/about' | '/recovery' | '/'
  fileRoutesByTo: FileRoutesByTo
  to: '/playground' | '/about' | '/recovery' | '/'
  id:
    | '__root__'
    | '/_layout'
    | '/playground'
    | '/_layout/about'
    | '/_layout/recovery'
    | '/_layout/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  LayoutRoute: typeof LayoutRouteWithChildren
  PlaygroundRoute: typeof PlaygroundRoute
}

const rootRouteChildren: RootRouteChildren = {
  LayoutRoute: LayoutRouteWithChildren,
  PlaygroundRoute: PlaygroundRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_layout",
        "/playground"
      ]
    },
    "/_layout": {
      "filePath": "_layout.tsx",
      "children": [
        "/_layout/about",
        "/_layout/recovery",
        "/_layout/"
      ]
    },
    "/playground": {
      "filePath": "playground.tsx"
    },
    "/_layout/about": {
      "filePath": "_layout.about.tsx",
      "parent": "/_layout"
    },
    "/_layout/recovery": {
      "filePath": "_layout.recovery.tsx",
      "parent": "/_layout"
    },
    "/_layout/": {
      "filePath": "_layout.index.tsx",
      "parent": "/_layout"
    }
  }
}
ROUTE_MANIFEST_END */
