import { use } from 'react'

import { TabsContext } from './TabsContext'
import type {
  ThrowTabsContextErrorUtilType,
  UseGetActiveTabHookType,
  UseGetIsFluidHookType,
  UseGetOnTabClickHookType,
} from './TabsContext.types'

const throwTabsContextError: ThrowTabsContextErrorUtilType = () => {
  throw new Error('TabsContext не задан!')
}

export const useGetActiveTab: UseGetActiveTabHookType = () => {
  const ctx = use(TabsContext)
  if (ctx) {
    return ctx.activeTab
  }
  throwTabsContextError()
}

export const useGetOnTabClick: UseGetOnTabClickHookType = () => {
  const ctx = use(TabsContext)
  if (ctx) {
    return ctx.onTabClick
  }
  throwTabsContextError()
}

export const useGetIsFluid: UseGetIsFluidHookType = () => {
  const ctx = use(TabsContext)
  if (ctx) {
    return !!ctx.isFluid
  }
  throwTabsContextError()
}
