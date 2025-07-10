export default defineBackground(() => {
  ContextMenu.create()
})

namespace ContextMenu {
  export function create() {
    browser.contextMenus.create({
      contexts: ['action'],
      id: 'id',
      title: 'Porto ID',
    })
    browser.contextMenus.create({
      contexts: ['action'],
      id: 'docs',
      title: 'Docs',
    })

    browser.contextMenus.create({
      checked: true,
      contexts: ['action'],
      id: 'preview',
      title: 'Developer Preview',
      type: 'radio',
    })
    browser.contextMenus.create({
      checked: false,
      contexts: ['action'],
      id: 'release',
      title: 'Release (Beta)',
      type: 'radio',
    })

    browser.contextMenus.onClicked.addListener(async (info) => {
      const env = await Env.get()
      if (info.menuItemId === 'id')
        browser.tabs.create({
          url:
            env === 'stg'
              ? 'https://id.porto.sh'
              : `https://${env}.id.porto.sh`,
        })
      if (info.menuItemId === 'docs')
        browser.tabs.create({
          url: env === 'stg' ? 'https://porto.sh' : `https://${env}.porto.sh`,
        })

      if (info.menuItemId === 'preview') Env.set('stg')
      if (info.menuItemId === 'release') Env.set('prod')
    })
  }
}

namespace Env {
  type Env = 'stg' | 'prod'
  type Storage = { env: Env }

  const defaultEnv = 'stg'

  export async function set(env: Env) {
    await browser.storage.local.set({ env })
    return env
  }

  export async function get() {
    const { env } = await browser.storage.local.get<Storage>('env')
    if (!env) return set(defaultEnv)
    return env
  }
}
