import type { ReactNode } from 'react'

import type { ApplyMode } from 'src/typings'

export type TabIdType = number | string

export type TabClickHandler = (tabId: TabIdType) => void

export type TabModeType = 'uncontrolled' | 'controlled'

export type GetTabsModeUtilType = (activeTabId?: TabIdType) => TabModeType

export type CheckIfTabsModeChangedUtilType = (tabsMode: TabModeType, activeTabId?: TabIdType) => boolean

interface TabsBasePropsType {
  /**
   * Задаёт контент компонента
   */
  children: ReactNode
  /**
   * Растягивает табы на всю ширину контейнера
   */
  isFluid?: boolean
}

type TabsControlledPropsType = TabsBasePropsType & {
  /**
   * Задаёт id активного таба, используется в controlled режиме табов
   */
  activeTabId: TabIdType
  defaultTabId?: never
  /**
   * Обработчик переключения табов
   */
  onTabClick: TabClickHandler
}

type TabsUncontrolledPropsType = TabsBasePropsType & {
  activeTabId?: never
  /**
   * Задаёт id дефолтного таба, используется в uncontrolled режиме табов
   */
  defaultTabId: TabIdType
  /**
   * Обработчик переключения табов
   */
  onTabClick?: TabClickHandler
}

type TabsCommonPropsType = TabsControlledPropsType | TabsUncontrolledPropsType

/**
 * Интерфейс компонента `Tabs`
 */
export type TabsPropsType<
  Keys extends keyof TabsCommonPropsType = keyof TabsCommonPropsType,
  Mode extends 'Pick' | 'Omit' = 'Pick',
> = ApplyMode<TabsControlledPropsType, Keys, Mode> | ApplyMode<TabsUncontrolledPropsType, Keys, Mode>
