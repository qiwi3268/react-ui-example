import type { ReactElement } from 'react'

import type { TabIdType } from '../../Tabs.types'

/**
 * Интерфейс компонента `TabContent`
 */
export interface TabContentPropsType {
  /**
   * Контент таба
   */
  children: ReactElement
  /**
   * Идентификатор таба
   */
  tabId: TabIdType
  /**
   * Задаёт наличие отступов у компонента
   */
  withPaddings?: boolean
}
