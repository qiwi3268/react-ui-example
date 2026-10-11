import type { HTMLAttributes, ReactElement, Ref } from 'react'

import type { WithDataTestIdPropsType } from 'src/typings'

type PrevNextButtonPropsType = Pick<HTMLAttributes<HTMLButtonElement>, 'aria-label'>

export type TabsScrollDirectionType = 'previous' | 'next'

export interface TabsScrollElementsType {
  container: HTMLDivElement
  startControl: HTMLDivElement | null
  endControl: HTMLDivElement | null
}

export interface TabsViewportType {
  left: number
  right: number
}

/**
 * Интерфейс компонента `TabsHeader`
 */
export interface TabsHeaderPropsType
  extends WithDataTestIdPropsType, Pick<HTMLAttributes<HTMLDivElement>, 'className'> {
  /**
   * Дочерние компоненты (TabTitle)
   */
  children: ReactElement[]
  /**
   * Устанавливает бордер для контейнера табов
   * @default true
   */
  withBorder?: boolean
  /**
   * Задаёт параметры кнопки прокрутки назад
   */
  prevButtonProps?: PrevNextButtonPropsType
  /**
   * Задаёт параметры кнопки прокрутки вперёд
   */
  nextButtonProps?: PrevNextButtonPropsType
  /**
   * Задаёт ref
   */
  ref?: Ref<HTMLDivElement>
}
