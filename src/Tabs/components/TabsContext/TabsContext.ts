import { createContext } from 'react'

import type { TabsContextType } from './TabsContext.types'

export const TabsContext = createContext<TabsContextType | undefined>(undefined)
