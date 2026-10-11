import { createContext } from 'react'

type EnsureTabVisibleType = (element: HTMLElement) => void

// Необязательный контекст сохраняет возможность использовать TabTitle без TabsHeader
export const TabsScrollContext = createContext<EnsureTabVisibleType | null>(null)
