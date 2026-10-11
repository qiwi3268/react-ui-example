import type { JSX, ReactNode } from 'react'

import type { TabClickHandler, TabIdType } from '../../Tabs.types'

export interface TabsContextType {
  /**
   * Задаёт id активного таба
   */
  activeTab: TabIdType
  /**
   * Обработчик переключения табов
   */
  onTabClick: TabClickHandler
  /**
   * Растягивает табы на всю ширину контейнера
   */
  isFluid?: boolean
}

export type UseGetActiveTabHookType = () => TabIdType
export type UseGetOnTabClickHookType = () => TabClickHandler
export type UseGetIsFluidHookType = () => boolean
export type ThrowTabsContextErrorUtilType = () => never

export interface TabsContextProviderPropsType {
  onTabClick: TabClickHandler
  activeTab: TabIdType
  children: ReactNode
  isFluid?: boolean
}

export type TabsContextProviderType = (props: TabsContextProviderPropsType) => JSX.Element
