/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as PlaygroundImport } from './routes/playground'
import { Route as ManagerImport } from './routes/_manager'
import { Route as DialogImport } from './routes/_dialog'
import { Route as ManagerIndexImport } from './routes/_manager/index'
import { Route as ManagerCreateAccountImport } from './routes/_manager/create-account'
import { Route as ManagerSettingsIndexImport } from './routes/_manager/settings/index'
import { Route as DialogDialogIndexImport } from './routes/_dialog.dialog/index'
import { Route as ManagerSettingsPermissionsImport } from './routes/_manager/settings/permissions'
import { Route as DialogDialogWalletsendCallsImport } from './routes/_dialog.dialog/wallet_sendCalls'
import { Route as DialogDialogWalletconnectImport } from './routes/_dialog.dialog/wallet_connect'
import { Route as DialogDialogPersonalsignImport } from './routes/_dialog.dialog/personal_sign'
import { Route as DialogDialogExperimentalgrantPermissionsImport } from './routes/_dialog.dialog/experimental_grantPermissions'
import { Route as DialogDialogExperimentalcreateAccountImport } from './routes/_dialog.dialog/experimental_createAccount'
import { Route as DialogDialogEthsendTransactionImport } from './routes/_dialog.dialog/eth_sendTransaction'
import { Route as DialogDialogEthrequestAccountsImport } from './routes/_dialog.dialog/eth_requestAccounts'
import { Route as DialogDialogSplatImport } from './routes/_dialog.dialog/$'
import { Route as ManagerSettingsRecoveryIndexImport } from './routes/_manager/settings/recovery/index'
import { Route as ManagerSettingsRecoveryWalletIndexImport } from './routes/_manager/settings/recovery/wallet/index'
import { Route as ManagerSettingsRecoveryWalletPhraseImport } from './routes/_manager/settings/recovery/wallet/phrase'

// Create/Update Routes

const PlaygroundRoute = PlaygroundImport.update({
  id: '/playground',
  path: '/playground',
  getParentRoute: () => rootRoute,
} as any)

const ManagerRoute = ManagerImport.update({
  id: '/_manager',
  getParentRoute: () => rootRoute,
} as any)

const DialogRoute = DialogImport.update({
  id: '/_dialog',
  getParentRoute: () => rootRoute,
} as any)

const ManagerIndexRoute = ManagerIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => ManagerRoute,
} as any)

const ManagerCreateAccountRoute = ManagerCreateAccountImport.update({
  id: '/create-account',
  path: '/create-account',
  getParentRoute: () => ManagerRoute,
} as any)

const ManagerSettingsIndexRoute = ManagerSettingsIndexImport.update({
  id: '/settings/',
  path: '/settings/',
  getParentRoute: () => ManagerRoute,
} as any)

const DialogDialogIndexRoute = DialogDialogIndexImport.update({
  id: '/dialog/',
  path: '/dialog/',
  getParentRoute: () => DialogRoute,
} as any)

const ManagerSettingsPermissionsRoute = ManagerSettingsPermissionsImport.update(
  {
    id: '/settings/permissions',
    path: '/settings/permissions',
    getParentRoute: () => ManagerRoute,
  } as any,
)

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

const ManagerSettingsRecoveryIndexRoute =
  ManagerSettingsRecoveryIndexImport.update({
    id: '/settings/recovery/',
    path: '/settings/recovery/',
    getParentRoute: () => ManagerRoute,
  } as any)

const ManagerSettingsRecoveryWalletIndexRoute =
  ManagerSettingsRecoveryWalletIndexImport.update({
    id: '/settings/recovery/wallet/',
    path: '/settings/recovery/wallet/',
    getParentRoute: () => ManagerRoute,
  } as any)

const ManagerSettingsRecoveryWalletPhraseRoute =
  ManagerSettingsRecoveryWalletPhraseImport.update({
    id: '/settings/recovery/wallet/phrase',
    path: '/settings/recovery/wallet/phrase',
    getParentRoute: () => ManagerRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_dialog': {
      id: '/_dialog'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof DialogImport
      parentRoute: typeof rootRoute
    }
    '/_manager': {
      id: '/_manager'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof ManagerImport
      parentRoute: typeof rootRoute
    }
    '/playground': {
      id: '/playground'
      path: '/playground'
      fullPath: '/playground'
      preLoaderRoute: typeof PlaygroundImport
      parentRoute: typeof rootRoute
    }
    '/_manager/create-account': {
      id: '/_manager/create-account'
      path: '/create-account'
      fullPath: '/create-account'
      preLoaderRoute: typeof ManagerCreateAccountImport
      parentRoute: typeof ManagerImport
    }
    '/_manager/': {
      id: '/_manager/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof ManagerIndexImport
      parentRoute: typeof ManagerImport
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
    '/_manager/settings/permissions': {
      id: '/_manager/settings/permissions'
      path: '/settings/permissions'
      fullPath: '/settings/permissions'
      preLoaderRoute: typeof ManagerSettingsPermissionsImport
      parentRoute: typeof ManagerImport
    }
    '/_dialog/dialog/': {
      id: '/_dialog/dialog/'
      path: '/dialog'
      fullPath: '/dialog'
      preLoaderRoute: typeof DialogDialogIndexImport
      parentRoute: typeof DialogImport
    }
    '/_manager/settings/': {
      id: '/_manager/settings/'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof ManagerSettingsIndexImport
      parentRoute: typeof ManagerImport
    }
    '/_manager/settings/recovery/': {
      id: '/_manager/settings/recovery/'
      path: '/settings/recovery'
      fullPath: '/settings/recovery'
      preLoaderRoute: typeof ManagerSettingsRecoveryIndexImport
      parentRoute: typeof ManagerImport
    }
    '/_manager/settings/recovery/wallet/phrase': {
      id: '/_manager/settings/recovery/wallet/phrase'
      path: '/settings/recovery/wallet/phrase'
      fullPath: '/settings/recovery/wallet/phrase'
      preLoaderRoute: typeof ManagerSettingsRecoveryWalletPhraseImport
      parentRoute: typeof ManagerImport
    }
    '/_manager/settings/recovery/wallet/': {
      id: '/_manager/settings/recovery/wallet/'
      path: '/settings/recovery/wallet'
      fullPath: '/settings/recovery/wallet'
      preLoaderRoute: typeof ManagerSettingsRecoveryWalletIndexImport
      parentRoute: typeof ManagerImport
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
  DialogDialogIndexRoute: typeof DialogDialogIndexRoute
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
  DialogDialogIndexRoute: DialogDialogIndexRoute,
}

const DialogRouteWithChildren =
  DialogRoute._addFileChildren(DialogRouteChildren)

interface ManagerRouteChildren {
  ManagerCreateAccountRoute: typeof ManagerCreateAccountRoute
  ManagerIndexRoute: typeof ManagerIndexRoute
  ManagerSettingsPermissionsRoute: typeof ManagerSettingsPermissionsRoute
  ManagerSettingsIndexRoute: typeof ManagerSettingsIndexRoute
  ManagerSettingsRecoveryIndexRoute: typeof ManagerSettingsRecoveryIndexRoute
  ManagerSettingsRecoveryWalletPhraseRoute: typeof ManagerSettingsRecoveryWalletPhraseRoute
  ManagerSettingsRecoveryWalletIndexRoute: typeof ManagerSettingsRecoveryWalletIndexRoute
}

const ManagerRouteChildren: ManagerRouteChildren = {
  ManagerCreateAccountRoute: ManagerCreateAccountRoute,
  ManagerIndexRoute: ManagerIndexRoute,
  ManagerSettingsPermissionsRoute: ManagerSettingsPermissionsRoute,
  ManagerSettingsIndexRoute: ManagerSettingsIndexRoute,
  ManagerSettingsRecoveryIndexRoute: ManagerSettingsRecoveryIndexRoute,
  ManagerSettingsRecoveryWalletPhraseRoute:
    ManagerSettingsRecoveryWalletPhraseRoute,
  ManagerSettingsRecoveryWalletIndexRoute:
    ManagerSettingsRecoveryWalletIndexRoute,
}

const ManagerRouteWithChildren =
  ManagerRoute._addFileChildren(ManagerRouteChildren)

export interface FileRoutesByFullPath {
  '': typeof ManagerRouteWithChildren
  '/playground': typeof PlaygroundRoute
  '/create-account': typeof ManagerCreateAccountRoute
  '/': typeof ManagerIndexRoute
  '/dialog/$': typeof DialogDialogSplatRoute
  '/dialog/eth_requestAccounts': typeof DialogDialogEthrequestAccountsRoute
  '/dialog/eth_sendTransaction': typeof DialogDialogEthsendTransactionRoute
  '/dialog/experimental_createAccount': typeof DialogDialogExperimentalcreateAccountRoute
  '/dialog/experimental_grantPermissions': typeof DialogDialogExperimentalgrantPermissionsRoute
  '/dialog/personal_sign': typeof DialogDialogPersonalsignRoute
  '/dialog/wallet_connect': typeof DialogDialogWalletconnectRoute
  '/dialog/wallet_sendCalls': typeof DialogDialogWalletsendCallsRoute
  '/settings/permissions': typeof ManagerSettingsPermissionsRoute
  '/dialog': typeof DialogDialogIndexRoute
  '/settings': typeof ManagerSettingsIndexRoute
  '/settings/recovery': typeof ManagerSettingsRecoveryIndexRoute
  '/settings/recovery/wallet/phrase': typeof ManagerSettingsRecoveryWalletPhraseRoute
  '/settings/recovery/wallet': typeof ManagerSettingsRecoveryWalletIndexRoute
}

export interface FileRoutesByTo {
  '': typeof DialogRouteWithChildren
  '/playground': typeof PlaygroundRoute
  '/create-account': typeof ManagerCreateAccountRoute
  '/': typeof ManagerIndexRoute
  '/dialog/$': typeof DialogDialogSplatRoute
  '/dialog/eth_requestAccounts': typeof DialogDialogEthrequestAccountsRoute
  '/dialog/eth_sendTransaction': typeof DialogDialogEthsendTransactionRoute
  '/dialog/experimental_createAccount': typeof DialogDialogExperimentalcreateAccountRoute
  '/dialog/experimental_grantPermissions': typeof DialogDialogExperimentalgrantPermissionsRoute
  '/dialog/personal_sign': typeof DialogDialogPersonalsignRoute
  '/dialog/wallet_connect': typeof DialogDialogWalletconnectRoute
  '/dialog/wallet_sendCalls': typeof DialogDialogWalletsendCallsRoute
  '/settings/permissions': typeof ManagerSettingsPermissionsRoute
  '/dialog': typeof DialogDialogIndexRoute
  '/settings': typeof ManagerSettingsIndexRoute
  '/settings/recovery': typeof ManagerSettingsRecoveryIndexRoute
  '/settings/recovery/wallet/phrase': typeof ManagerSettingsRecoveryWalletPhraseRoute
  '/settings/recovery/wallet': typeof ManagerSettingsRecoveryWalletIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_dialog': typeof DialogRouteWithChildren
  '/_manager': typeof ManagerRouteWithChildren
  '/playground': typeof PlaygroundRoute
  '/_manager/create-account': typeof ManagerCreateAccountRoute
  '/_manager/': typeof ManagerIndexRoute
  '/_dialog/dialog/$': typeof DialogDialogSplatRoute
  '/_dialog/dialog/eth_requestAccounts': typeof DialogDialogEthrequestAccountsRoute
  '/_dialog/dialog/eth_sendTransaction': typeof DialogDialogEthsendTransactionRoute
  '/_dialog/dialog/experimental_createAccount': typeof DialogDialogExperimentalcreateAccountRoute
  '/_dialog/dialog/experimental_grantPermissions': typeof DialogDialogExperimentalgrantPermissionsRoute
  '/_dialog/dialog/personal_sign': typeof DialogDialogPersonalsignRoute
  '/_dialog/dialog/wallet_connect': typeof DialogDialogWalletconnectRoute
  '/_dialog/dialog/wallet_sendCalls': typeof DialogDialogWalletsendCallsRoute
  '/_manager/settings/permissions': typeof ManagerSettingsPermissionsRoute
  '/_dialog/dialog/': typeof DialogDialogIndexRoute
  '/_manager/settings/': typeof ManagerSettingsIndexRoute
  '/_manager/settings/recovery/': typeof ManagerSettingsRecoveryIndexRoute
  '/_manager/settings/recovery/wallet/phrase': typeof ManagerSettingsRecoveryWalletPhraseRoute
  '/_manager/settings/recovery/wallet/': typeof ManagerSettingsRecoveryWalletIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/playground'
    | '/create-account'
    | '/'
    | '/dialog/$'
    | '/dialog/eth_requestAccounts'
    | '/dialog/eth_sendTransaction'
    | '/dialog/experimental_createAccount'
    | '/dialog/experimental_grantPermissions'
    | '/dialog/personal_sign'
    | '/dialog/wallet_connect'
    | '/dialog/wallet_sendCalls'
    | '/settings/permissions'
    | '/dialog'
    | '/settings'
    | '/settings/recovery'
    | '/settings/recovery/wallet/phrase'
    | '/settings/recovery/wallet'
  fileRoutesByTo: FileRoutesByTo
  to:
    | ''
    | '/playground'
    | '/create-account'
    | '/'
    | '/dialog/$'
    | '/dialog/eth_requestAccounts'
    | '/dialog/eth_sendTransaction'
    | '/dialog/experimental_createAccount'
    | '/dialog/experimental_grantPermissions'
    | '/dialog/personal_sign'
    | '/dialog/wallet_connect'
    | '/dialog/wallet_sendCalls'
    | '/settings/permissions'
    | '/dialog'
    | '/settings'
    | '/settings/recovery'
    | '/settings/recovery/wallet/phrase'
    | '/settings/recovery/wallet'
  id:
    | '__root__'
    | '/_dialog'
    | '/_manager'
    | '/playground'
    | '/_manager/create-account'
    | '/_manager/'
    | '/_dialog/dialog/$'
    | '/_dialog/dialog/eth_requestAccounts'
    | '/_dialog/dialog/eth_sendTransaction'
    | '/_dialog/dialog/experimental_createAccount'
    | '/_dialog/dialog/experimental_grantPermissions'
    | '/_dialog/dialog/personal_sign'
    | '/_dialog/dialog/wallet_connect'
    | '/_dialog/dialog/wallet_sendCalls'
    | '/_manager/settings/permissions'
    | '/_dialog/dialog/'
    | '/_manager/settings/'
    | '/_manager/settings/recovery/'
    | '/_manager/settings/recovery/wallet/phrase'
    | '/_manager/settings/recovery/wallet/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  DialogRoute: typeof DialogRouteWithChildren
  ManagerRoute: typeof ManagerRouteWithChildren
  PlaygroundRoute: typeof PlaygroundRoute
}

const rootRouteChildren: RootRouteChildren = {
  DialogRoute: DialogRouteWithChildren,
  ManagerRoute: ManagerRouteWithChildren,
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
        "/_dialog",
        "/_manager",
        "/playground"
      ]
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
        "/_dialog/dialog/wallet_sendCalls",
        "/_dialog/dialog/"
      ]
    },
    "/_manager": {
      "filePath": "_manager.tsx",
      "children": [
        "/_manager/create-account",
        "/_manager/",
        "/_manager/settings/permissions",
        "/_manager/settings/",
        "/_manager/settings/recovery/",
        "/_manager/settings/recovery/wallet/phrase",
        "/_manager/settings/recovery/wallet/"
      ]
    },
    "/playground": {
      "filePath": "playground.tsx"
    },
    "/_manager/create-account": {
      "filePath": "_manager/create-account.tsx",
      "parent": "/_manager"
    },
    "/_manager/": {
      "filePath": "_manager/index.tsx",
      "parent": "/_manager"
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
    },
    "/_manager/settings/permissions": {
      "filePath": "_manager/settings/permissions.tsx",
      "parent": "/_manager"
    },
    "/_dialog/dialog/": {
      "filePath": "_dialog.dialog/index.tsx",
      "parent": "/_dialog"
    },
    "/_manager/settings/": {
      "filePath": "_manager/settings/index.tsx",
      "parent": "/_manager"
    },
    "/_manager/settings/recovery/": {
      "filePath": "_manager/settings/recovery/index.tsx",
      "parent": "/_manager"
    },
    "/_manager/settings/recovery/wallet/phrase": {
      "filePath": "_manager/settings/recovery/wallet/phrase.tsx",
      "parent": "/_manager"
    },
    "/_manager/settings/recovery/wallet/": {
      "filePath": "_manager/settings/recovery/wallet/index.tsx",
      "parent": "/_manager"
    }
  }
}
ROUTE_MANIFEST_END */
