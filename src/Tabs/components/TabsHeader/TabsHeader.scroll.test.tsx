import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  TEST_SCROLL_BUTTON_LABEL_PATTERN,
  TEST_SCROLL_CLOSE_LABEL_PREFIX,
  TEST_SCROLL_EXTERNAL_INPUT_LABEL,
  TEST_SCROLL_HEADER_TEST_ID,
  TEST_SCROLL_NEXT_LABEL,
  TEST_SCROLL_PREVIOUS_LABEL,
  TEST_SCROLL_SPACING_CLASS_NAME,
  TEST_SCROLL_TAB_TEST_ID_PREFIX,
} from './__fixtures__/consts'
import { flushTabsMeasurements, renderScrollableTabs } from './__fixtures__/scroll'

describe('tabsHeader: прокрутка', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it.each([
    { scenario: 'вкладки помещаются', options: { width: 700 } },
    { scenario: 'список пуст', options: { widths: [] } },
  ])('скрывает кнопки, когда $scenario', async ({ options }) => {
    expect.hasAssertions()

    renderScrollableTabs(options)
    await flushTabsMeasurements()

    expect(screen.queryByRole('button', { name: TEST_SCROLL_BUTTON_LABEL_PATTERN })).not.toBeInTheDocument()
  })

  it('в начале показывает только кнопку вперёд', async () => {
    expect.hasAssertions()

    renderScrollableTabs()
    await flushTabsMeasurements()

    expect(screen.getAllByRole('button', { name: TEST_SCROLL_BUTTON_LABEL_PATTERN })).toStrictEqual([
      screen.getByRole('button', { name: TEST_SCROLL_NEXT_LABEL }),
    ])
  })

  it('в середине показывает обе кнопки после нативной прокрутки', async () => {
    expect.hasAssertions()

    const { header } = renderScrollableTabs()
    await flushTabsMeasurements()
    header.scrollLeft = 100
    fireEvent.scroll(header)
    await flushTabsMeasurements()

    expect(screen.getAllByRole('button', { name: TEST_SCROLL_BUTTON_LABEL_PATTERN })).toHaveLength(2)
  })

  it('в конце показывает только кнопку назад с учётом дробной позиции', async () => {
    expect.hasAssertions()

    const { header } = renderScrollableTabs()
    await flushTabsMeasurements()
    header.scrollLeft = header.scrollWidth - header.clientWidth - 0.5
    fireEvent.scroll(header)
    await flushTabsMeasurements()

    expect(screen.getAllByRole('button', { name: TEST_SCROLL_BUTTON_LABEL_PATTERN })).toStrictEqual([
      screen.getByRole('button', { name: TEST_SCROLL_PREVIOUS_LABEL }),
    ])
  })

  it('кнопка вперёд раскрывает ближайшую скрытую вкладку без переключения контента', async () => {
    expect.hasAssertions()

    const { header, onTabClick } = renderScrollableTabs()
    await flushTabsMeasurements()
    fireEvent.click(screen.getByRole('button', { name: TEST_SCROLL_NEXT_LABEL }))

    expect(header.scrollLeft).toBe(12)
    expect(onTabClick).not.toHaveBeenCalled()
  })

  it('кнопка назад раскрывает ближайшую скрытую вкладку слева', async () => {
    expect.hasAssertions()

    const { header } = renderScrollableTabs()
    await flushTabsMeasurements()
    header.scrollLeft = 150
    fireEvent.scroll(header)
    await flushTabsMeasurements()
    fireEvent.click(screen.getByRole('button', { name: TEST_SCROLL_PREVIOUS_LABEL }))

    expect(header.scrollLeft).toBe(68)
  })

  it('доскролливает частично видимую вкладку при клике', async () => {
    expect.hasAssertions()

    const { header, onTabClick } = renderScrollableTabs()
    await flushTabsMeasurements()
    fireEvent.click(screen.getByTestId(`${TEST_SCROLL_TAB_TEST_ID_PREFIX}2`))

    expect(header.scrollLeft).toBe(12)
    expect(onTabClick).toHaveBeenCalledExactlyOnceWith(2)
  })

  it('доскролливает повторно выбранную активную вкладку', async () => {
    expect.hasAssertions()

    const { header, onTabClick } = renderScrollableTabs({ activeTabId: 2 })
    await flushTabsMeasurements()
    fireEvent.click(screen.getByTestId(`${TEST_SCROLL_TAB_TEST_ID_PREFIX}2`))

    expect(header.scrollLeft).toBe(12)
    expect(onTabClick).not.toHaveBeenCalled()
  })

  it('повторные клики по активной вкладке сохраняют плавный доскролл', async () => {
    expect.hasAssertions()

    const { header, onTabClick } = renderScrollableTabs({ activeTabId: 2, isAnimated: true })
    await flushTabsMeasurements()
    const tab = screen.getByTestId(`${TEST_SCROLL_TAB_TEST_ID_PREFIX}2`)
    fireEvent.focus(tab)
    fireEvent.click(tab)
    act(() => {
      vi.advanceTimersByTime(32)
    })

    expect(header.scrollLeft).toBeGreaterThan(0)
    expect(header.scrollLeft).toBeLessThan(12)

    fireEvent.click(tab)
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(header.scrollLeft).toBeCloseTo(12)
    expect(onTabClick).not.toHaveBeenCalled()
  })

  it('доскролливает вкладку при получении клавиатурного фокуса без выбора', async () => {
    expect.hasAssertions()

    const { header, onTabClick } = renderScrollableTabs()
    await flushTabsMeasurements()
    fireEvent.focus(screen.getByTestId(`${TEST_SCROLL_TAB_TEST_ID_PREFIX}2`))

    expect(header.scrollLeft).toBe(12)
    expect(onTabClick).not.toHaveBeenCalled()
  })

  it.each([
    { edge: 'левой', widths: [100, 100, 100, 100, 100], position: 90, tabId: 0, target: 44 },
    { edge: 'правой', widths: [100, 400, 100], position: 150, tabId: 1, target: 212 },
  ])(
    'раскрывает кнопку закрытия под $edge стрелкой при фокусе без выбора',
    async ({ widths, position, tabId, target }) => {
      expect.hasAssertions()

      const { header, onTabClick, onClose } = renderScrollableTabs({ widths })
      await flushTabsMeasurements()
      header.scrollLeft = position
      fireEvent.scroll(header)
      await flushTabsMeasurements()
      const tab = screen.getByTestId(`${TEST_SCROLL_TAB_TEST_ID_PREFIX}${tabId}`)
      const closeButton = screen.getByRole('button', { name: `${TEST_SCROLL_CLOSE_LABEL_PREFIX}${tabId}` })
      Object.defineProperty(closeButton, 'getBoundingClientRect', {
        configurable: true,
        value: () => DOMRect.fromRect({ x: tab.getBoundingClientRect().right - 24, width: 24, height: 24 }),
      })

      act(() => closeButton.focus())

      expect(closeButton).toHaveFocus()
      expect(header.scrollLeft).toBe(target)
      expect(onTabClick).not.toHaveBeenCalled()
      expect(onClose).not.toHaveBeenCalled()
    },
  )

  it('не прокручивает полностью видимую вкладку', async () => {
    expect.hasAssertions()

    const { scrollTo } = renderScrollableTabs()
    await flushTabsMeasurements()
    fireEvent.click(screen.getByTestId(`${TEST_SCROLL_TAB_TEST_ID_PREFIX}1`))

    expect(scrollTo).not.toHaveBeenCalled()
  })

  it('не прокручивает и не выбирает заблокированную вкладку', async () => {
    expect.hasAssertions()

    const { scrollTo, onTabClick } = renderScrollableTabs()
    await flushTabsMeasurements()
    fireEvent.click(screen.getByTestId(`${TEST_SCROLL_TAB_TEST_ID_PREFIX}3`))

    expect(scrollTo).not.toHaveBeenCalled()
    expect(onTabClick).not.toHaveBeenCalled()
  })

  it('закрытие вкладки не вызывает доскролл и выбор', async () => {
    expect.hasAssertions()

    const { scrollTo, onTabClick, onClose } = renderScrollableTabs()
    await flushTabsMeasurements()
    fireEvent.click(screen.getByRole('button', { name: `${TEST_SCROLL_CLOSE_LABEL_PREFIX}2` }))

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(scrollTo).not.toHaveBeenCalled()
    expect(onTabClick).not.toHaveBeenCalled()
  })

  it('скрывает стрелки после расширения, если сами вкладки помещаются', async () => {
    expect.hasAssertions()

    const { layout, resize } = renderScrollableTabs()
    await flushTabsMeasurements()
    layout.width = 520
    await resize()

    expect(screen.queryByRole('button', { name: TEST_SCROLL_BUTTON_LABEL_PATTERN })).not.toBeInTheDocument()
  })

  it('показывает кнопки при увеличении ширины заголовка без изменения контейнера', async () => {
    expect.hasAssertions()

    const { layout, resize } = renderScrollableTabs({ width: 520 })
    await flushTabsMeasurements()
    layout.tabs[2]!.width = 200
    await resize()

    expect(screen.getByRole('button', { name: TEST_SCROLL_NEXT_LABEL })).toBeInTheDocument()
  })

  it('обновляет переполнение при добавлении и удалении вкладок', async () => {
    expect.hasAssertions()

    const { layout, rerenderTabs } = renderScrollableTabs({ widths: [100, 100] })
    await flushTabsMeasurements()
    layout.tabs.push({ id: 2, width: 200 })
    rerenderTabs()
    await flushTabsMeasurements()

    expect(screen.getByRole('button', { name: TEST_SCROLL_NEXT_LABEL })).toBeInTheDocument()

    layout.tabs.pop()
    rerenderTabs()
    await flushTabsMeasurements()

    expect(screen.queryByRole('button', { name: TEST_SCROLL_BUTTON_LABEL_PATTERN })).not.toBeInTheDocument()
  })

  it('учитывает отступы при первом измерении и после изменения ширины', async () => {
    expect.hasAssertions()

    const { header, layout, resize } = renderScrollableTabs({ className: TEST_SCROLL_SPACING_CLASS_NAME })
    const style = document.createElement('style')
    style.textContent = `.${TEST_SCROLL_SPACING_CLASS_NAME}[data-testid="${TEST_SCROLL_HEADER_TEST_ID}"] { column-gap: 12px; padding-right: 12px; }`
    document.head.append(style)

    try {
      await flushTabsMeasurements()
      const next = screen.getByRole('button', { name: TEST_SCROLL_NEXT_LABEL })
      fireEvent.click(next)

      expect(header.scrollLeft).toBe(48)

      style.textContent = ''
      header.scrollLeft = 0
      layout.width = 280
      await resize()
      fireEvent.click(next)

      expect(header.scrollLeft).toBe(52)
    } finally {
      style.remove()
    }
  })

  it('пролистывает вкладку шире контейнера частями', async () => {
    expect.hasAssertions()

    const { header } = renderScrollableTabs({ widths: [700, 100] })
    await flushTabsMeasurements()
    fireEvent.click(screen.getByRole('button', { name: TEST_SCROLL_NEXT_LABEL }))

    expect(header.scrollLeft).toBe(288)
  })

  it('даёт сфокусировать правую стрелку клавишей Tab до автопрокрутки вкладок', async () => {
    expect.hasAssertions()

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    const { header, onTabClick } = renderScrollableTabs()
    await flushTabsMeasurements()
    await user.tab()
    await flushTabsMeasurements()

    expect(screen.getByRole('button', { name: TEST_SCROLL_NEXT_LABEL })).toHaveFocus()
    expect(header.scrollLeft).toBe(0)
    expect(onTabClick).not.toHaveBeenCalled()
  })

  it.each([
    {
      interaction: 'кликов',
      press: (button: HTMLElement) => {
        fireEvent.click(button)
      },
    },
    {
      interaction: 'касаний',
      press: (button: HTMLElement) => {
        fireEvent.touchStart(button)
        fireEvent.pointerDown(button)
        fireEvent.click(button)
      },
    },
  ])('достигает накопленной цели после повторных $interaction', async ({ press }) => {
    expect.hasAssertions()

    const { header, onTabClick } = renderScrollableTabs({ widths: Array(8).fill(100), isAnimated: true })
    await flushTabsMeasurements()
    const next = screen.getByRole('button', { name: TEST_SCROLL_NEXT_LABEL })
    press(next)
    act(() => {
      vi.advanceTimersByTime(16)
    })
    press(next)
    press(next)
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(header.scrollLeft).toBe(212)
    expect(onTabClick).not.toHaveBeenCalled()
  })

  it('меняет направление от текущего положения, не доигрывая накопленную цель', async () => {
    expect.hasAssertions()

    const { header } = renderScrollableTabs({ widths: Array(8).fill(100), isAnimated: true })
    await flushTabsMeasurements()
    const next = screen.getByRole('button', { name: TEST_SCROLL_NEXT_LABEL })
    fireEvent.click(next)
    fireEvent.click(next)
    act(() => {
      vi.advanceTimersByTime(32)
    })

    expect(header.scrollLeft).toBeGreaterThan(0)

    fireEvent.click(screen.getByRole('button', { name: TEST_SCROLL_PREVIOUS_LABEL }))
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(header.scrollLeft).toBe(0)
  })

  it.each(['wheel', 'touchStart'])(
    'ручное взаимодействие останавливает анимацию и сбрасывает накопленную цель (%s)',
    async (event) => {
      expect.hasAssertions()

      const { header, scrollTo } = renderScrollableTabs({ isAnimated: true })
      await flushTabsMeasurements()
      const next = screen.getByRole('button', { name: TEST_SCROLL_NEXT_LABEL })
      fireEvent.click(next)
      fireEvent.click(next)
      act(() => {
        vi.advanceTimersByTime(16)
      })
      fireEvent[event as 'wheel' | 'touchStart'](header)
      scrollTo.mockClear()
      act(() => {
        vi.advanceTimersByTime(500)
      })

      expect(scrollTo).not.toHaveBeenCalled()

      header.scrollLeft = 5
      fireEvent.scroll(header)
      fireEvent.click(next)
      act(() => {
        vi.advanceTimersByTime(500)
      })

      expect(header.scrollLeft).toBe(12)
    },
  )

  it.each([
    {
      interaction: 'click',
      interact: (input: HTMLElement) => {
        fireEvent.pointerDown(input)
        fireEvent.click(input)
      },
    },
    {
      interaction: 'input',
      interact: (input: HTMLElement) => {
        fireEvent.keyDown(input, { key: 'a' })
        fireEvent.input(input, { target: { value: 'a' } })
      },
    },
  ])('действие вне вкладок не прерывает анимацию ($interaction)', async ({ interact }) => {
    expect.hasAssertions()

    const { header } = renderScrollableTabs({ isAnimated: true })
    render(<input aria-label={TEST_SCROLL_EXTERNAL_INPUT_LABEL} />)
    await flushTabsMeasurements()
    fireEvent.click(screen.getByRole('button', { name: TEST_SCROLL_NEXT_LABEL }))
    act(() => {
      vi.advanceTimersByTime(16)
    })

    expect(header.scrollLeft).toBeGreaterThan(0)

    const input = screen.getByRole('textbox', { name: TEST_SCROLL_EXTERNAL_INPUT_LABEL })

    interact(input)

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(header.scrollLeft).toBe(12)
  })

  it('выбор вкладки заменяет накопленную цель', async () => {
    expect.hasAssertions()

    const { header, onTabClick } = renderScrollableTabs({ isAnimated: true })
    await flushTabsMeasurements()
    const next = screen.getByRole('button', { name: TEST_SCROLL_NEXT_LABEL })
    fireEvent.click(next)
    fireEvent.click(next)
    fireEvent.click(screen.getByTestId(`${TEST_SCROLL_TAB_TEST_ID_PREFIX}4`))
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(header.scrollLeft).toBe(180)
    expect(onTabClick).toHaveBeenCalledExactlyOnceWith(4)
  })
})
