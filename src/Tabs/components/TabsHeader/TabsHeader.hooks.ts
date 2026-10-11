import { type FocusEventHandler, useCallback, useEffect, useRef, useState } from 'react'

import { getTabsElements, getTabsMeasurements } from './TabsHeader.utils'
import { useTabsScrollAnimation } from './useTabsScrollAnimation'

/** Следит за состоянием шапки и объединяет запросы измерений в один кадр */
export const useTabsScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const startControlRef = useRef<HTMLDivElement>(null)
  const endControlRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number | null>(null)
  const [scrollState, setScrollState] = useState({
    hasOverflow: false,
    canScrollPrevious: false,
    canScrollNext: false,
    columnGap: '0px',
  })

  const getElements = useCallback(() => {
    if (!containerRef.current) {
      return null
    }

    return {
      container: containerRef.current,
      startControl: startControlRef.current,
      endControl: endControlRef.current,
    }
  }, [])

  const updateScrollState = useCallback(() => {
    const elements = getElements()

    if (!elements) {
      return
    }

    const { hasOverflow, canScrollPrevious, canScrollNext, columnGap } = getTabsMeasurements(elements)
    const { activeElement } = elements.container.ownerDocument

    const isPreviousControlFocused = !canScrollPrevious && elements.startControl?.contains(activeElement)
    const isNextControlFocused = !canScrollNext && elements.endControl?.contains(activeElement)

    if (isPreviousControlFocused || isNextControlFocused) {
      // Переносим фокус с исчезающей стрелки на крайнюю доступную вкладку, не выбирая её
      const focusableTabs = getTabsElements(elements).filter((tab) => tab.tabIndex >= 0)
      const targetTab = isPreviousControlFocused ? focusableTabs[0] : focusableTabs.at(-1)
      targetTab?.focus({ preventScroll: true })

      if (!targetTab) {
        elements.container.focus({ preventScroll: true })
      }
    }

    setScrollState((previous) =>
      previous.hasOverflow === hasOverflow &&
      previous.canScrollPrevious === canScrollPrevious &&
      previous.canScrollNext === canScrollNext &&
      previous.columnGap === columnGap
        ? previous
        : { hasOverflow, canScrollPrevious, canScrollNext, columnGap },
    )
  }, [getElements])

  const scheduleUpdate = useCallback(() => {
    frameRef.current ??= requestAnimationFrame(() => {
      frameRef.current = null
      updateScrollState()
    })
  }, [updateScrollState])

  useEffect(() => {
    const elements = getElements()

    if (!elements) {
      return
    }

    const resizeObserver = new ResizeObserver(scheduleUpdate)
    const observeTabs = () => {
      const currentElements = getElements()

      if (currentElements) {
        resizeObserver.disconnect()
        resizeObserver.observe(currentElements.container)
        getTabsElements(currentElements).forEach((tab) => resizeObserver.observe(tab, { box: 'border-box' }))
        scheduleUpdate()
      }
    }
    const mutationObserver = new MutationObserver(observeTabs)

    observeTabs()
    mutationObserver.observe(elements.container, { childList: true })

    return () => {
      resizeObserver.disconnect()
      mutationObserver.disconnect()

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
    }
  }, [getElements, scheduleUpdate])

  const { scrollTo, ensureVisible } = useTabsScrollAnimation(getElements)
  const handleScrollPrevious = useCallback(() => scrollTo('previous'), [scrollTo])
  const handleScrollNext = useCallback(() => scrollTo('next'), [scrollTo])
  const handleFocus: FocusEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      const elements = getElements()

      if (
        elements &&
        event.target.tabIndex >= 0 &&
        getTabsElements(elements).some((tab) => tab.contains(event.target))
      ) {
        ensureVisible(event.target)
      }
    },
    [ensureVisible, getElements],
  )

  return {
    ...scrollState,
    containerRef,
    startControlRef,
    endControlRef,
    ensureVisible,
    handleScroll: scheduleUpdate,
    handleFocus,
    handleScrollPrevious,
    handleScrollNext,
  }
}
