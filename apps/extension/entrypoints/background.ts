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

    browser.contextMenus.onClicked.addListener(async (info) => {
      if (info.menuItemId === 'id')
        browser.tabs.create({
          url: 'https://id.porto.sh',
        })
      if (info.menuItemId === 'docs')
        browser.tabs.create({
          url: 'https://porto.sh',
        })
    })
  }
}
