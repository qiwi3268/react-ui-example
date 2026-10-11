import type { MouseEvent, Ref } from 'react'

import type { BadgeCounterPropsType } from 'src/components/design-system/BadgeCounter'
import type { IconNameType } from 'src/components/design-system/Icon'
import type { WithCloseButtonPropsType, WithDataTestIdPropsType } from 'src/typings'

import type { TabIdType } from '../../Tabs.types'

/**
 * Интерфейс компонента `TabTitle`
 */
export interface TabTitlePropsType extends WithDataTestIdPropsType, WithCloseButtonPropsType {
  /**
   * Задаёт идентификатор таба
   */
  tabId: TabIdType
  /**
   * Задаёт заголовок таба
   */
  title: string
  /**
   * Делает таб недоступным для выбора
   */
  isDisabled?: boolean
  /**
   * Задаёт параметры для бейджа
   */
  badgeCounterProps?: BadgeCounterPropsType
  /**
   * Задаёт обработчик закрытия таба
   */
  onClose?: (event: MouseEvent<HTMLButtonElement>, tabId: TabIdType) => void
  /**
   * Задаёт иконку
   */
  icon?: IconNameType
  /**
   * Задаёт ref
   */
  ref?: Ref<HTMLDivElement>
}
