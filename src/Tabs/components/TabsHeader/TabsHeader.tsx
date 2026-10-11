import { useMergedRef } from 'web/react-libs'
import classnames from 'classnames'
import { type CSSProperties, type PointerEventHandler, memo, useCallback, useState } from 'react'

import { Button } from 'src/components/design-system/Button'
import { Flex } from 'src/components/design-system/Flex'

import { TabsScrollContext } from '../TabsScrollContext'

import { DEFAULT_BUTTON_PROPS } from './TabsHeader.consts'
import { useTabsScroll } from './TabsHeader.hooks'
import styles from './TabsHeader.module.scss'
import type { TabsHeaderPropsType, TabsScrollDirectionType } from './TabsHeader.types'

/**
 * Компонент, отображающий заголовки табов
 */
export const TabsHeader = memo(
  ({
    children,
    withBorder = true,
    prevButtonProps = DEFAULT_BUTTON_PROPS,
    nextButtonProps = DEFAULT_BUTTON_PROPS,
    className,
    ref,
    ...rest
  }: TabsHeaderPropsType) => {
    const {
      containerRef,
      startControlRef,
      endControlRef,
      hasOverflow,
      canScrollPrevious,
      canScrollNext,
      columnGap,
      ensureVisible,
      handleScroll,
      handleFocus,
      handleScrollPrevious,
      handleScrollNext,
    } = useTabsScroll()
    const { 'aria-label': prevButtonAriaLabel = 'Прокрутить вкладки назад' } = prevButtonProps
    const { 'aria-label': nextButtonAriaLabel = 'Прокрутить вкладки вперёд' } = nextButtonProps
    const controlStyle = { '--tabs-scroll-gap': columnGap } as CSSProperties
    const mergedRef = useMergedRef(containerRef, ref)
    const [hoveredControl, setHoveredControl] = useState<TabsScrollDirectionType | null>(null)
    const handleControlPointerEnter: PointerEventHandler<HTMLDivElement> = useCallback(
      (event) => setHoveredControl(event.currentTarget === startControlRef.current ? 'previous' : 'next'),
      [startControlRef],
    )
    const handleControlPointerLeave = useCallback(() => setHoveredControl(null), [])

    return (
      <Flex
        {...rest}
        className={classnames(styles.TabsHeader, className, { [styles.withBorder!]: withBorder })}
        ref={mergedRef}
        tabIndex={-1}
        onFocus={handleFocus}
        onScroll={handleScroll}
      >
        {hasOverflow && (
          <div
            className={classnames(styles.ScrollControl, styles.isStart, {
              [styles.withBorder!]: withBorder,
              [styles.isHidden!]: !canScrollPrevious && hoveredControl !== 'previous',
              [styles.isPointerGuard!]: !canScrollPrevious && hoveredControl === 'previous',
            })}
            ref={startControlRef}
            style={controlStyle}
            onPointerEnter={handleControlPointerEnter}
            onPointerLeave={handleControlPointerLeave}
          >
            {canScrollPrevious && (
              <Button
                aria-label={prevButtonAriaLabel}
                icon="chevronLeft"
                kind="ghost"
                size="small"
                onClick={handleScrollPrevious}
              />
            )}
          </div>
        )}
        {hasOverflow && (
          <div
            className={classnames(styles.ScrollControl, styles.isEnd, {
              [styles.withBorder!]: withBorder,
              [styles.isHidden!]: !canScrollNext && hoveredControl !== 'next',
              [styles.isPointerGuard!]: !canScrollNext && hoveredControl === 'next',
            })}
            ref={endControlRef}
            style={controlStyle}
            onPointerEnter={handleControlPointerEnter}
            onPointerLeave={handleControlPointerLeave}
          >
            {canScrollNext && (
              <Button
                aria-label={nextButtonAriaLabel}
                icon="chevronRight"
                kind="ghost"
                size="small"
                onClick={handleScrollNext}
              />
            )}
          </div>
        )}
        <TabsScrollContext value={ensureVisible}>{children}</TabsScrollContext>
      </Flex>
    )
  },
)

TabsHeader.displayName = 'TabsHeader'
