import { useMemo } from 'react'

import { TabsContext } from './TabsContext'
import type { TabsContextProviderType, TabsContextType } from './TabsContext.types'

export const TabsContextProvider: TabsContextProviderType = ({ activeTab, onTabClick, isFluid, children }) => {
  const contextValue = useMemo<TabsContextType>(
    () => ({ activeTab, onTabClick, isFluid }),
    [activeTab, isFluid, onTabClick],
  )

  return <TabsContext value={contextValue}>{children}</TabsContext>
}
