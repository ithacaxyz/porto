/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as WithdrawImport } from './routes/withdraw'
import { Route as PlaygroundImport } from './routes/playground'
import { Route as DialogImport } from './routes/_dialog'
import { Route as IndexImport } from './routes/index'
import { Route as SettingsIndexImport } from './routes/settings/index'
import { Route as SettingsPermissionsImport } from './routes/settings/permissions'
import { Route as DialogDialogWalletsendCallsImport } from './routes/_dialog.dialog/wallet_sendCalls'
import { Route as DialogDialogWalletconnectImport } from './routes/_dialog.dialog/wallet_connect'
import { Route as DialogDialogPersonalsignImport } from './routes/_dialog.dialog/personal_sign'
import { Route as DialogDialogExperimentalgrantPermissionsImport } from './routes/_dialog.dialog/experimental_grantPermissions'
import { Route as DialogDialogExperimentalcreateAccountImport } from './routes/_dialog.dialog/experimental_createAccount'
import { Route as DialogDialogEthsendTransactionImport } from './routes/_dialog.dialog/eth_sendTransaction'
import { Route as DialogDialogEthrequestAccountsImport } from './routes/_dialog.dialog/eth_requestAccounts'
import { Route as DialogDialogSplatImport } from './routes/_dialog.dialog/$'

// Create/Update Routes

const WithdrawRoute = WithdrawImport.update({
  id: '/withdraw',
  path: '/withdraw',
  getParentRoute: () => rootRoute,
} as any)

const PlaygroundRoute = PlaygroundImport.update({
  id: '/playground',
  path: '/playground',
  getParentRoute: () => rootRoute,
} as any)

const DialogRoute = DialogImport.update({
  id: '/_dialog',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const SettingsIndexRoute = SettingsIndexImport.update({
  id: '/settings/',
  path: '/settings/',
  getParentRoute: () => rootRoute,
} as any)

const SettingsPermissionsRoute = SettingsPermissionsImport.update({
  id: '/settings/permissions',
  path: '/settings/permissions',
  getParentRoute: () => rootRoute,
} as any)

const DialogDialogWalletsendCallsRoute =
  DialogDialogWalletsendCallsImport.update({
    id: '/dialog/wallet_sendCalls',
    path: '/dialog/wallet_sendCalls',
    getParentRoute: () => DialogRoute,
  } as any)

const DialogDialogWalletconnectRoute = DialogDialogWalletconnectImport.update({
  id: '/dialog/wallet_connect',
  path: '/dialog/wallet_connect',
  getParentRoute: () => DialogRoute,
} as any)

const DialogDialogPersonalsignRoute = DialogDialogPersonalsignImport.update({
  id: '/dialog/personal_sign',
  path: '/dialog/personal_sign',
  getParentRoute: () => DialogRoute,
} as any)

const DialogDialogExperimentalgrantPermissionsRoute =
  DialogDialogExperimentalgrantPermissionsImport.update({
    id: '/dialog/experimental_grantPermissions',
    path: '/dialog/experimental_grantPermissions',
    getParentRoute: () => DialogRoute,
  } as any)

const DialogDialogExperimentalcreateAccountRoute =
  DialogDialogExperimentalcreateAccountImport.update({
    id: '/dialog/experimental_createAccount',
    path: '/dialog/experimental_createAccount',
    getParentRoute: () => DialogRoute,
  } as any)

const DialogDialogEthsendTransactionRoute =
  DialogDialogEthsendTransactionImport.update({
    id: '/dialog/eth_sendTransaction',
    path: '/dialog/eth_sendTransaction',
    getParentRoute: () => DialogRoute,
  } as any)

const DialogDialogEthrequestAccountsRoute =
  DialogDialogEthrequestAccountsImport.update({
    id: '/dialog/eth_requestAccounts',
    path: '/dialog/eth_requestAccounts',
    getParentRoute: () => DialogRoute,
  } as any)

const DialogDialogSplatRoute = DialogDialogSplatImport.update({
  id: '/dialog/$',
  path: '/dialog/$',
  getParentRoute: () => DialogRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/_dialog': {
      id: '/_dialog'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof DialogImport
      parentRoute: typeof rootRoute
    }
    '/playground': {
      id: '/playground'
      path: '/playground'
      fullPath: '/playground'
      preLoaderRoute: typeof PlaygroundImport
      parentRoute: typeof rootRoute
    }
    '/withdraw': {
      id: '/withdraw'
      path: '/withdraw'
      fullPath: '/withdraw'
      preLoaderRoute: typeof WithdrawImport
      parentRoute: typeof rootRoute
    }
    '/settings/permissions': {
      id: '/settings/permissions'
      path: '/settings/permissions'
      fullPath: '/settings/permissions'
      preLoaderRoute: typeof SettingsPermissionsImport
      parentRoute: typeof rootRoute
    }
    '/settings/': {
      id: '/settings/'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof SettingsIndexImport
      parentRoute: typeof rootRoute
    }
    '/_dialog/dialog/$': {
      id: '/_dialog/dialog/$'
      path: '/dialog/$'
      fullPath: '/dialog/$'
      preLoaderRoute: typeof DialogDialogSplatImport
      parentRoute: typeof DialogImport
    }
    '/_dialog/dialog/eth_requestAccounts': {
      id: '/_dialog/dialog/eth_requestAccounts'
      path: '/dialog/eth_requestAccounts'
      fullPath: '/dialog/eth_requestAccounts'
      preLoaderRoute: typeof DialogDialogEthrequestAccountsImport
      parentRoute: typeof DialogImport
    }
    '/_dialog/dialog/eth_sendTransaction': {
      id: '/_dialog/dialog/eth_sendTransaction'
      path: '/dialog/eth_sendTransaction'
      fullPath: '/dialog/eth_sendTransaction'
      preLoaderRoute: typeof DialogDialogEthsendTransactionImport
      parentRoute: typeof DialogImport
    }
    '/_dialog/dialog/experimental_createAccount': {
      id: '/_dialog/dialog/experimental_createAccount'
      path: '/dialog/experimental_createAccount'
      fullPath: '/dialog/experimental_createAccount'
      preLoaderRoute: typeof DialogDialogExperimentalcreateAccountImport
      parentRoute: typeof DialogImport
    }
    '/_dialog/dialog/experimental_grantPermissions': {
      id: '/_dialog/dialog/experimental_grantPermissions'
      path: '/dialog/experimental_grantPermissions'
      fullPath: '/dialog/experimental_grantPermissions'
      preLoaderRoute: typeof DialogDialogExperimentalgrantPermissionsImport
      parentRoute: typeof DialogImport
    }
    '/_dialog/dialog/personal_sign': {
      id: '/_dialog/dialog/personal_sign'
      path: '/dialog/personal_sign'
      fullPath: '/dialog/personal_sign'
      preLoaderRoute: typeof DialogDialogPersonalsignImport
      parentRoute: typeof DialogImport
    }
    '/_dialog/dialog/wallet_connect': {
      id: '/_dialog/dialog/wallet_connect'
      path: '/dialog/wallet_connect'
      fullPath: '/dialog/wallet_connect'
      preLoaderRoute: typeof DialogDialogWalletconnectImport
      parentRoute: typeof DialogImport
    }
    '/_dialog/dialog/wallet_sendCalls': {
      id: '/_dialog/dialog/wallet_sendCalls'
      path: '/dialog/wallet_sendCalls'
      fullPath: '/dialog/wallet_sendCalls'
      preLoaderRoute: typeof DialogDialogWalletsendCallsImport
      parentRoute: typeof DialogImport
    }
  }
}

// Create and export the route tree

interface DialogRouteChildren {
  DialogDialogSplatRoute: typeof DialogDialogSplatRoute
  DialogDialogEthrequestAccountsRoute: typeof DialogDialogEthrequestAccountsRoute
  DialogDialogEthsendTransactionRoute: typeof DialogDialogEthsendTransactionRoute
  DialogDialogExperimentalcreateAccountRoute: typeof DialogDialogExperimentalcreateAccountRoute
  DialogDialogExperimentalgrantPermissionsRoute: typeof DialogDialogExperimentalgrantPermissionsRoute
  DialogDialogPersonalsignRoute: typeof DialogDialogPersonalsignRoute
  DialogDialogWalletconnectRoute: typeof DialogDialogWalletconnectRoute
  DialogDialogWalletsendCallsRoute: typeof DialogDialogWalletsendCallsRoute
}

const DialogRouteChildren: DialogRouteChildren = {
  DialogDialogSplatRoute: DialogDialogSplatRoute,
  DialogDialogEthrequestAccountsRoute: DialogDialogEthrequestAccountsRoute,
  DialogDialogEthsendTransactionRoute: DialogDialogEthsendTransactionRoute,
  DialogDialogExperimentalcreateAccountRoute:
    DialogDialogExperimentalcreateAccountRoute,
  DialogDialogExperimentalgrantPermissionsRoute:
    DialogDialogExperimentalgrantPermissionsRoute,
  DialogDialogPersonalsignRoute: DialogDialogPersonalsignRoute,
  DialogDialogWalletconnectRoute: DialogDialogWalletconnectRoute,
  DialogDialogWalletsendCallsRoute: DialogDialogWalletsendCallsRoute,
}

const DialogRouteWithChildren =
  DialogRoute._addFileChildren(DialogRouteChildren)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '': typeof DialogRouteWithChildren
  '/playground': typeof PlaygroundRoute
  '/withdraw': typeof WithdrawRoute
  '/settings/permissions': typeof SettingsPermissionsRoute
  '/settings': typeof SettingsIndexRoute
  '/dialog/$': typeof DialogDialogSplatRoute
  '/dialog/eth_requestAccounts': typeof DialogDialogEthrequestAccountsRoute
  '/dialog/eth_sendTransaction': typeof DialogDialogEthsendTransactionRoute
  '/dialog/experimental_createAccount': typeof DialogDialogExperimentalcreateAccountRoute
  '/dialog/experimental_grantPermissions': typeof DialogDialogExperimentalgrantPermissionsRoute
  '/dialog/personal_sign': typeof DialogDialogPersonalsignRoute
  '/dialog/wallet_connect': typeof DialogDialogWalletconnectRoute
  '/dialog/wallet_sendCalls': typeof DialogDialogWalletsendCallsRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '': typeof DialogRouteWithChildren
  '/playground': typeof PlaygroundRoute
  '/withdraw': typeof WithdrawRoute
  '/settings/permissions': typeof SettingsPermissionsRoute
  '/settings': typeof SettingsIndexRoute
  '/dialog/$': typeof DialogDialogSplatRoute
  '/dialog/eth_requestAccounts': typeof DialogDialogEthrequestAccountsRoute
  '/dialog/eth_sendTransaction': typeof DialogDialogEthsendTransactionRoute
  '/dialog/experimental_createAccount': typeof DialogDialogExperimentalcreateAccountRoute
  '/dialog/experimental_grantPermissions': typeof DialogDialogExperimentalgrantPermissionsRoute
  '/dialog/personal_sign': typeof DialogDialogPersonalsignRoute
  '/dialog/wallet_connect': typeof DialogDialogWalletconnectRoute
  '/dialog/wallet_sendCalls': typeof DialogDialogWalletsendCallsRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/_dialog': typeof DialogRouteWithChildren
  '/playground': typeof PlaygroundRoute
  '/withdraw': typeof WithdrawRoute
  '/settings/permissions': typeof SettingsPermissionsRoute
  '/settings/': typeof SettingsIndexRoute
  '/_dialog/dialog/$': typeof DialogDialogSplatRoute
  '/_dialog/dialog/eth_requestAccounts': typeof DialogDialogEthrequestAccountsRoute
  '/_dialog/dialog/eth_sendTransaction': typeof DialogDialogEthsendTransactionRoute
  '/_dialog/dialog/experimental_createAccount': typeof DialogDialogExperimentalcreateAccountRoute
  '/_dialog/dialog/experimental_grantPermissions': typeof DialogDialogExperimentalgrantPermissionsRoute
  '/_dialog/dialog/personal_sign': typeof DialogDialogPersonalsignRoute
  '/_dialog/dialog/wallet_connect': typeof DialogDialogWalletconnectRoute
  '/_dialog/dialog/wallet_sendCalls': typeof DialogDialogWalletsendCallsRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | ''
    | '/playground'
    | '/withdraw'
    | '/settings/permissions'
    | '/settings'
    | '/dialog/$'
    | '/dialog/eth_requestAccounts'
    | '/dialog/eth_sendTransaction'
    | '/dialog/experimental_createAccount'
    | '/dialog/experimental_grantPermissions'
    | '/dialog/personal_sign'
    | '/dialog/wallet_connect'
    | '/dialog/wallet_sendCalls'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | ''
    | '/playground'
    | '/withdraw'
    | '/settings/permissions'
    | '/settings'
    | '/dialog/$'
    | '/dialog/eth_requestAccounts'
    | '/dialog/eth_sendTransaction'
    | '/dialog/experimental_createAccount'
    | '/dialog/experimental_grantPermissions'
    | '/dialog/personal_sign'
    | '/dialog/wallet_connect'
    | '/dialog/wallet_sendCalls'
  id:
    | '__root__'
    | '/'
    | '/_dialog'
    | '/playground'
    | '/withdraw'
    | '/settings/permissions'
    | '/settings/'
    | '/_dialog/dialog/$'
    | '/_dialog/dialog/eth_requestAccounts'
    | '/_dialog/dialog/eth_sendTransaction'
    | '/_dialog/dialog/experimental_createAccount'
    | '/_dialog/dialog/experimental_grantPermissions'
    | '/_dialog/dialog/personal_sign'
    | '/_dialog/dialog/wallet_connect'
    | '/_dialog/dialog/wallet_sendCalls'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  DialogRoute: typeof DialogRouteWithChildren
  PlaygroundRoute: typeof PlaygroundRoute
  WithdrawRoute: typeof WithdrawRoute
  SettingsPermissionsRoute: typeof SettingsPermissionsRoute
  SettingsIndexRoute: typeof SettingsIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  DialogRoute: DialogRouteWithChildren,
  PlaygroundRoute: PlaygroundRoute,
  WithdrawRoute: WithdrawRoute,
  SettingsPermissionsRoute: SettingsPermissionsRoute,
  SettingsIndexRoute: SettingsIndexRoute,
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
        "/",
        "/_dialog",
        "/playground",
        "/withdraw",
        "/settings/permissions",
        "/settings/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/_dialog": {
      "filePath": "_dialog.tsx",
      "children": [
        "/_dialog/dialog/$",
        "/_dialog/dialog/eth_requestAccounts",
        "/_dialog/dialog/eth_sendTransaction",
        "/_dialog/dialog/experimental_createAccount",
        "/_dialog/dialog/experimental_grantPermissions",
        "/_dialog/dialog/personal_sign",
        "/_dialog/dialog/wallet_connect",
        "/_dialog/dialog/wallet_sendCalls"
      ]
    },
    "/playground": {
      "filePath": "playground.tsx"
    },
    "/withdraw": {
      "filePath": "withdraw.tsx"
    },
    "/settings/permissions": {
      "filePath": "settings/permissions.tsx"
    },
    "/settings/": {
      "filePath": "settings/index.tsx"
    },
    "/_dialog/dialog/$": {
      "filePath": "_dialog.dialog/$.tsx",
      "parent": "/_dialog"
    },
    "/_dialog/dialog/eth_requestAccounts": {
      "filePath": "_dialog.dialog/eth_requestAccounts.tsx",
      "parent": "/_dialog"
    },
    "/_dialog/dialog/eth_sendTransaction": {
      "filePath": "_dialog.dialog/eth_sendTransaction.tsx",
      "parent": "/_dialog"
    },
    "/_dialog/dialog/experimental_createAccount": {
      "filePath": "_dialog.dialog/experimental_createAccount.tsx",
      "parent": "/_dialog"
    },
    "/_dialog/dialog/experimental_grantPermissions": {
      "filePath": "_dialog.dialog/experimental_grantPermissions.tsx",
      "parent": "/_dialog"
    },
    "/_dialog/dialog/personal_sign": {
      "filePath": "_dialog.dialog/personal_sign.tsx",
      "parent": "/_dialog"
    },
    "/_dialog/dialog/wallet_connect": {
      "filePath": "_dialog.dialog/wallet_connect.tsx",
      "parent": "/_dialog"
    },
    "/_dialog/dialog/wallet_sendCalls": {
      "filePath": "_dialog.dialog/wallet_sendCalls.tsx",
      "parent": "/_dialog"
    }
  }
}
ROUTE_MANIFEST_END */
