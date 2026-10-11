import { TEST_SCROLL_CONTROL_CLASS_NAME, TEST_SCROLL_TAB_TEST_ID_PREFIX } from './consts'

interface TabsLayoutType {
  readonly width: number
  readonly tabs: readonly { readonly id: number; readonly width: number }[]
}

const getSpacing = (header: HTMLElement) => {
  const style = getComputedStyle(header)
  return {
    gap: Number.parseFloat(style.columnGap || style.gap) || 0,
    paddingLeft: Number.parseFloat(style.paddingLeft) || 0,
    paddingRight: Number.parseFloat(style.paddingRight) || 0,
  }
}

export const mockTabsGeometry = (header: HTMLElement, layout: TabsLayoutType) => {
  Object.defineProperty(header, 'getBoundingClientRect', {
    configurable: true,
    value: () => DOMRect.fromRect({ width: layout.width, height: 32 }),
  })
  const updateChildren = () => {
    for (const element of header.querySelectorAll<HTMLElement>(':scope > *')) {
      Object.defineProperty(element, 'getBoundingClientRect', {
        configurable: true,
        value: () => {
          if (element.classList.contains(TEST_SCROLL_CONTROL_CLASS_NAME)) {
            return DOMRect.fromRect({ width: 32, height: 32 })
          }

          const id = Number(element.dataset.testid?.replace(TEST_SCROLL_TAB_TEST_ID_PREFIX, ''))
          const index = layout.tabs.findIndex((tab) => tab.id === id)
          const before = layout.tabs.slice(0, index).reduce((total, tab) => total + tab.width, 0)
          const { gap, paddingLeft } = getSpacing(header)
          return DOMRect.fromRect({
            x: paddingLeft + before + index * gap - header.scrollLeft,
            width: layout.tabs[index]?.width ?? 0,
            height: 32,
          })
        },
      })
    }
  }
  updateChildren()
  Object.defineProperties(header, {
    clientWidth: { configurable: true, get: () => layout.width },
    scrollWidth: {
      configurable: true,
      get: () => {
        const { gap, paddingLeft, paddingRight } = getSpacing(header)
        const contentWidth = layout.tabs.reduce((total, item) => total + item.width, 0)
        return Math.max(
          layout.width,
          paddingLeft + contentWidth + Math.max(0, layout.tabs.length - 1) * gap + paddingRight,
        )
      },
    },
  })
  const observer = new MutationObserver(updateChildren)
  observer.observe(header, { childList: true })
  return () => observer.disconnect()
}
