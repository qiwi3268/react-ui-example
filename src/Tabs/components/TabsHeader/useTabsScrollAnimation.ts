import { useCallback, useEffect, useRef } from 'react'

import { SCROLL_SMOOTHING_TIME, SCROLL_TOLERANCE } from './TabsHeader.consts'
import type { TabsScrollDirectionType, TabsScrollElementsType } from './TabsHeader.types'
import { getTabScrollOffset, getTabsMeasurements, getTabsScrollOffset, getTabsViewport } from './TabsHeader.utils'

interface ScrollAnimationType {
  readonly target: number
  readonly position: number
  readonly updatedAt: number
}

/**
 * Управляет общей RAF-анимацией стрелок и доскролла выбранной вкладки
 * Повторные нажатия продлевают цель; при отключённой в CSS плавности переход выполняется мгновенно
 */
export const useTabsScrollAnimation = (getElements: () => TabsScrollElementsType | null) => {
  const animationRef = useRef<ScrollAnimationType | null>(null)
  const frameRef = useRef<number | null>(null)

  const cancelAnimation = useCallback(() => {
    animationRef.current = null

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }
  }, [])

  const animate = useCallback(
    function handleAnimationFrame(time: number) {
      frameRef.current = null
      const elements = getElements()
      const animation = animationRef.current

      if (!elements || !animation) {
        cancelAnimation()
        return
      }

      const { container } = elements
      const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth)
      const target = Math.max(0, Math.min(maxScroll, animation.target))
      const progress = 1 - Math.exp(-Math.max(0, time - animation.updatedAt) / SCROLL_SMOOTHING_TIME)
      const position = animation.position + (target - animation.position) * progress
      const isFinished = Math.abs(target - position) <= SCROLL_TOLERANCE

      container.scrollTo({ left: isFinished ? target : position, behavior: 'instant' })

      if (isFinished) {
        cancelAnimation()
        return
      }

      animationRef.current = { target, position, updatedAt: time }
      frameRef.current = requestAnimationFrame(handleAnimationFrame)
    },
    [cancelAnimation, getElements],
  )

  const startAnimation = useCallback(
    (container: HTMLElement, target: number) => {
      const animation = animationRef.current

      if (Math.abs(target - container.scrollLeft) <= SCROLL_TOLERANCE) {
        cancelAnimation()
        return
      }

      if (getComputedStyle(container).scrollBehavior !== 'smooth') {
        cancelAnimation()
        container.scrollTo({ left: target, behavior: 'instant' })
        return
      }

      animationRef.current = animation
        ? { ...animation, target }
        : {
            target,
            position: container.scrollLeft,
            updatedAt: performance.now(),
          }

      frameRef.current ??= requestAnimationFrame((time) => {
        const pending = animationRef.current

        if (pending) {
          container.scrollTo({ left: container.scrollLeft, behavior: 'instant' })
          animationRef.current = {
            ...pending,
            position: container.scrollLeft,
          }
        }

        animate(time)
      })
    },
    [animate, cancelAnimation],
  )

  const scrollTo = useCallback(
    (direction: TabsScrollDirectionType) => {
      const elements = getElements()

      if (!elements) {
        return
      }

      const { container } = elements
      const animation = animationRef.current
      const isMovingRight = direction === 'next'
      const remaining = (animation?.target ?? container.scrollLeft) - container.scrollLeft
      const isContinuing = animation && Math.sign(remaining) === (isMovingRight ? 1 : -1)
      const start = isContinuing ? animation.target : container.scrollLeft
      const measurements = getTabsMeasurements(elements, start)
      const { maxScroll } = measurements
      const offset = getTabsScrollOffset(
        measurements,
        getTabsViewport(elements, measurements),
        direction,
        start - container.scrollLeft,
      )
      const target = Math.max(0, Math.min(maxScroll, start + offset))

      startAnimation(container, target)
    },
    [getElements, startAnimation],
  )

  /**
   * Меняет цель на выбранную вкладку или останавливает движение, если она уже видна
   */
  const ensureVisible = useCallback(
    (tab: HTMLElement) => {
      const elements = getElements()

      if (!elements?.container.contains(tab)) {
        return
      }

      const { container } = elements
      const measurements = getTabsMeasurements(elements)
      const viewport = getTabsViewport(elements, measurements)
      const offset = getTabScrollOffset(tab.getBoundingClientRect(), viewport)

      if (Math.abs(offset) > SCROLL_TOLERANCE) {
        startAnimation(container, Math.max(0, Math.min(measurements.maxScroll, container.scrollLeft + offset)))
      } else {
        cancelAnimation()
      }
    },
    [cancelAnimation, getElements, startAnimation],
  )

  useEffect(() => {
    const container = getElements()?.container
    const handleInteractionStart = (event: Event) => {
      const elements = getElements()
      const { target } = event

      if (
        target instanceof Node &&
        (elements?.startControl?.contains(target) || elements?.endControl?.contains(target))
      ) {
        return
      }

      cancelAnimation()
    }

    container?.addEventListener('wheel', cancelAnimation, { passive: true })
    container?.addEventListener('touchstart', handleInteractionStart, { passive: true })

    return () => {
      container?.removeEventListener('wheel', cancelAnimation)
      container?.removeEventListener('touchstart', handleInteractionStart)
      cancelAnimation()
    }
  }, [cancelAnimation, getElements])

  return { scrollTo, ensureVisible }
}
