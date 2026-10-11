import { SCROLL_TOLERANCE } from './TabsHeader.consts'
import type { TabsScrollDirectionType, TabsScrollElementsType, TabsViewportType } from './TabsHeader.types'

/**
 * Возвращает прямые дочерние элементы шапки без обёрток стрелок
 * @param elements Контейнер и обёртки стрелок
 * @param elements.container Контейнер заголовков вкладок
 * @param elements.startControl Обёртка кнопки прокрутки назад или null
 * @param elements.endControl Обёртка кнопки прокрутки вперёд или null
 * @returns HTML-элементы вкладок в порядке DOM без обёрток стрелок
 */
export const getTabsElements = ({ container, startControl, endControl }: TabsScrollElementsType) =>
  Array.from(container.children).filter(
    (element): element is HTMLElement =>
      element instanceof HTMLElement && element !== startControl && element !== endControl,
  )

/**
 * Определяет переполнение и доступность стрелок без измерения области видимости
 * @param elements Контейнер и обёртки стрелок
 * @param scrollLeft Расчётная позиция: по умолчанию текущая, при серии кликов — накопленная цель
 * @returns Вкладки, ширина и отступы контейнера, межколоночный интервал, признак переполнения,
 * максимальная позиция прокрутки и доступность прокрутки в каждом направлении
 */
export const getTabsMeasurements = (elements: TabsScrollElementsType, scrollLeft = elements.container.scrollLeft) => {
  const { container } = elements
  const tabs = getTabsElements(elements)
  const firstRect = tabs[0]?.getBoundingClientRect()
  const lastRect = tabs.at(-1)?.getBoundingClientRect()
  const styles = getComputedStyle(container)
  const paddingLeft = Number.parseFloat(styles.paddingLeft) || 0
  const paddingRight = Number.parseFloat(styles.paddingRight) || 0
  const contentWidth =
    firstRect && lastRect ? Math.max(firstRect.right, lastRect.right) - Math.min(firstRect.left, lastRect.left) : 0
  const containerWidth = container.clientWidth
  const availableWidth = containerWidth - paddingLeft - paddingRight
  // Ширину кнопок не учитываем при определении переполнения: иначе они могут сами удерживать скролл
  const hasOverflow = availableWidth > 0 && contentWidth > availableWidth + SCROLL_TOLERANCE
  const maxScroll = Math.max(0, container.scrollWidth - containerWidth)
  const position = Math.max(0, Math.min(scrollLeft, maxScroll))
  const canScrollPrevious = hasOverflow && position > SCROLL_TOLERANCE
  const canScrollNext = hasOverflow && maxScroll - position > SCROLL_TOLERANCE

  return {
    tabs,
    containerWidth,
    paddingLeft,
    paddingRight,
    columnGap: styles.columnGap && styles.columnGap !== 'normal' ? styles.columnGap : '0px',
    hasOverflow,
    maxScroll,
    canScrollPrevious,
    canScrollNext,
  }
}

/**
 * Возвращает границы области без отступов и перекрытия стрелками в координатах окна
 * Использует измерения для нужной расчётной позиции
 * @param elements Контейнер и обёртки стрелок
 * @param elements.container Контейнер заголовков вкладок
 * @param elements.startControl Обёртка кнопки прокрутки назад или null
 * @param elements.endControl Обёртка кнопки прокрутки вперёд или null
 * @param measurements Измерения шапки для расчётной позиции прокрутки
 * @param measurements.containerWidth Внутренняя ширина контейнера в пикселях
 * @param measurements.paddingLeft Левый внутренний отступ контейнера в пикселях
 * @param measurements.paddingRight Правый внутренний отступ контейнера в пикселях
 * @param measurements.canScrollPrevious Доступность прокрутки назад
 * @param measurements.canScrollNext Доступность прокрутки вперёд
 * @returns Левая и правая границы видимой области в пикселях относительно окна,
 * исключая внутренние отступы и области, перекрытые доступными стрелками
 */
export const getTabsViewport = (
  { container, startControl, endControl }: TabsScrollElementsType,
  {
    containerWidth,
    paddingLeft,
    paddingRight,
    canScrollPrevious,
    canScrollNext,
  }: ReturnType<typeof getTabsMeasurements>,
): TabsViewportType => {
  const left = container.getBoundingClientRect().left + container.clientLeft
  const startWidth = canScrollPrevious ? (startControl?.getBoundingClientRect().width ?? 0) : 0
  const endWidth = canScrollNext ? (endControl?.getBoundingClientRect().width ?? 0) : 0

  return {
    left: left + paddingLeft + startWidth,
    right: left + containerWidth - paddingRight - endWidth,
  }
}

/**
 * Вычисляет доскролл вкладки по границам в координатах окна
 * Вкладку, перекрывающую всю видимую область, не сдвигает
 * @param tab Левая и правая границы вкладки в координатах окна
 * @param viewport Левая и правая границы видимой области в координатах окна
 * @returns Сдвиг вправо со знаком плюс, влево — минус; 0, если доскролл не нужен
 */
export const getTabScrollOffset = (tab: TabsViewportType, viewport: TabsViewportType) => {
  if (tab.left < viewport.left && tab.right > viewport.right) {
    return 0
  }

  if (tab.left < viewport.left - SCROLL_TOLERANCE) {
    return tab.left - viewport.left
  }

  return tab.right > viewport.right + SCROLL_TOLERANCE ? tab.right - viewport.right : 0
}

/**
 * Вычисляет шаг к скрытой вкладке, не превышающий ширину видимой области
 * @param measurements Измерения шапки
 * @param measurements.tabs Вкладки в порядке отображения
 * @param viewport Видимая область для расчётной позиции
 * @param direction Направление прокрутки
 * @param shift Расчётная позиция минус фактический scrollLeft
 * @returns Сдвиг от расчётной позиции (+ вправо, − влево); итоговую цель ограничивает вызывающий код
 */
export const getTabsScrollOffset = (
  { tabs }: ReturnType<typeof getTabsMeasurements>,
  viewport: TabsViewportType,
  direction: TabsScrollDirectionType,
  shift = 0,
) => {
  const isNext = direction === 'next'
  const candidates = isNext ? tabs : [...tabs].reverse()
  const hiddenTab = candidates.find((tab) => {
    const rect = tab.getBoundingClientRect()

    return isNext
      ? rect.right - shift > viewport.right + SCROLL_TOLERANCE
      : rect.left - shift < viewport.left - SCROLL_TOLERANCE
  })
  const width = Math.max(0, viewport.right - viewport.left)
  const rect = hiddenTab?.getBoundingClientRect()
  if (!rect) {
    return isNext ? width : -width
  }

  const offset = isNext ? rect.right - shift - viewport.right : rect.left - shift - viewport.left

  // Вкладку шире области просмотра пролистываем частями, сохраняя доступ к её содержимому
  return isNext ? Math.min(offset, width) : Math.max(offset, -width)
}
