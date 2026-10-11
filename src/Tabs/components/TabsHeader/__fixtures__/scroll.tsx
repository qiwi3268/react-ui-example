import { act, fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { Tabs } from '../../../Tabs'
import type { TabsPropsType } from '../../../Tabs.types'
import { TabTitle, type TabTitlePropsType } from '../../TabTitle'
import { TabsHeader } from '../TabsHeader'

import {
  TEST_SCROLL_CLOSE_LABEL_PREFIX,
  TEST_SCROLL_HEADER_TEST_ID,
  TEST_SCROLL_MEASUREMENT_FLUSH_MS,
  TEST_SCROLL_TAB_TEST_ID_PREFIX,
} from './consts'
import { mockTabsGeometry } from './geometry'

interface ScrollFixtureOptionsType {
  width?: number
  widths?: readonly number[]
  isFluid?: boolean
  activeTabId?: number
  isAnimated?: boolean
  className?: string
}

export const flushTabsMeasurements = async () => {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(TEST_SCROLL_MEASUREMENT_FLUSH_MS)
  })
  await act(async () => {
    await vi.advanceTimersByTimeAsync(TEST_SCROLL_MEASUREMENT_FLUSH_MS)
  })
}

export const renderScrollableTabs = ({
  width = 320,
  widths = [100, 100, 100, 100, 100],
  isFluid = false,
  activeTabId,
  isAnimated = false,
  className,
}: ScrollFixtureOptionsType = {}) => {
  const layout = { width, tabs: widths.map((tabWidth, id) => ({ id, width: tabWidth })) }
  const onTabClick = vi.fn<NonNullable<TabsPropsType['onTabClick']>>()
  const onClose = vi.fn<NonNullable<TabTitlePropsType['onClose']>>()
  let cleanupGeometry: (() => void) | undefined
  const handleHeaderRef = (header: HTMLDivElement | null) => {
    cleanupGeometry?.()
    cleanupGeometry = header ? mockTabsGeometry(header, layout) : undefined
  }
  const getChildren = () =>
    layout.tabs.map(({ id }) => (
      <TabTitle
        closeButtonProps={{ 'aria-label': `${TEST_SCROLL_CLOSE_LABEL_PREFIX}${id}` }}
        data-testid={`${TEST_SCROLL_TAB_TEST_ID_PREFIX}${id}`}
        isDisabled={id === 3}
        key={id}
        tabId={id}
        title={`Вкладка ${id}`}
        onClose={onClose}
      />
    ))
  const getComponent = () => (
    <Tabs
      {...(activeTabId === undefined ? { defaultTabId: 0 } : { activeTabId })}
      isFluid={isFluid}
      onTabClick={onTabClick}
    >
      <TabsHeader className={className} data-testid={TEST_SCROLL_HEADER_TEST_ID} ref={handleHeaderRef}>
        {getChildren()}
      </TabsHeader>
    </Tabs>
  )
  const result = render(getComponent())
  const header = screen.getByTestId(TEST_SCROLL_HEADER_TEST_ID)
  header.style.scrollBehavior = isAnimated ? 'smooth' : 'auto'
  const scrollTo = vi.fn<(options: ScrollToOptions) => void>((options) => {
    const target = options.left ?? header.scrollLeft
    const maxScroll = header.scrollWidth - header.clientWidth
    header.scrollLeft = Math.max(0, Math.min(maxScroll, target))
    fireEvent.scroll(header)
  })

  Object.defineProperty(header, 'scrollTo', { configurable: true, value: scrollTo })

  const resize = async () => {
    const observer = vi.mocked(ResizeObserver).mock.calls.at(-1)?.[0]
    act(() => observer?.([], vi.mocked(ResizeObserver).mock.instances.at(-1)!))
    await flushTabsMeasurements()
  }

  return {
    ...result,
    header,
    layout,
    scrollTo,
    onTabClick,
    onClose,
    resize,
    rerenderTabs: () => result.rerender(getComponent()),
  }
}
