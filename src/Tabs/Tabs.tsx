import { memo, useCallback, useEffect, useState } from 'react'

import type { TabClickHandler, TabsPropsType } from './Tabs.types'
import { TabsContextProvider } from './components/TabsContext'

/**
 * Компонент, отображающий табы
 */
export const Tabs = memo(({ defaultTabId, activeTabId, children, onTabClick, isFluid }: TabsPropsType) => {
  const [localActiveTabId, setLocalActiveTabId] = useState(activeTabId ?? defaultTabId)

  const handleTabClick: TabClickHandler = useCallback(
    (tabId) => {
      const isSameLocalActiveTab = localActiveTabId === tabId
      const isSameActiveTab = activeTabId === tabId

      if (!activeTabId && !isSameLocalActiveTab) {
        setLocalActiveTabId(tabId)
      }

      if (activeTabId ? !isSameActiveTab : !isSameLocalActiveTab) {
        onTabClick?.(tabId)
      }
    },
    [onTabClick, localActiveTabId, activeTabId],
  )

  useEffect(() => {
    // eslint-disable-next-line @eslint-react/set-state-in-effect -- сброс localActiveTabId при переключении режима
    setLocalActiveTabId(activeTabId ?? defaultTabId)
  }, [activeTabId, defaultTabId])

  return (
    <TabsContextProvider activeTab={activeTabId ?? localActiveTabId} isFluid={isFluid} onTabClick={handleTabClick}>
      {children}
    </TabsContextProvider>
  )
})

Tabs.displayName = 'Tabs'
