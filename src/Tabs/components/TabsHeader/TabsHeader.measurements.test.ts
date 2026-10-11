import { afterEach, describe, expect, it, vi } from 'vitest'

import { getTabsMeasurements, getTabsViewport } from './TabsHeader.utils'

const createElements = () => {
  const container = document.createElement('div')
  const startControl = document.createElement('div')
  const endControl = document.createElement('div')
  const tabs = Array.from({ length: 8 }, (_, index) => {
    const tab = document.createElement('div')
    vi.spyOn(tab, 'getBoundingClientRect').mockImplementation(() =>
      DOMRect.fromRect({ x: index * 100 - container.scrollLeft, width: 100 }),
    )
    return tab
  })
  container.append(startControl, ...tabs, endControl)
  Object.defineProperties(container, {
    clientWidth: { value: 320 },
    scrollWidth: { value: 800 },
  })
  vi.spyOn(container, 'getBoundingClientRect').mockReturnValue(DOMRect.fromRect({ width: 320 }))
  vi.spyOn(startControl, 'getBoundingClientRect').mockReturnValue(DOMRect.fromRect({ width: 32 }))
  vi.spyOn(endControl, 'getBoundingClientRect').mockReturnValue(DOMRect.fromRect({ width: 32 }))
  return { container, startControl, endControl }
}

describe('`tabsHeader`: измерения', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it.each([
    { position: 0, canScrollPrevious: false, canScrollNext: true, left: 0, right: 288 },
    { position: 100, canScrollPrevious: true, canScrollNext: true, left: 32, right: 288 },
    { position: 480, canScrollPrevious: true, canScrollNext: false, left: 32, right: 320 },
  ])(
    'учитывает перекрытие стрелками для расчётной позиции $position',
    ({ position, canScrollPrevious, canScrollNext, left, right }) => {
      expect.hasAssertions()

      const elements = createElements()
      const measurements = getTabsMeasurements(elements, position)

      expect(measurements).toMatchObject({ hasOverflow: true, canScrollPrevious, canScrollNext })
      expect(getTabsViewport(elements, measurements)).toStrictEqual({ left, right })
    },
  )
})
