import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { TEST_ARIA_LABEL, TEST_HANDLER, TEST_ITEMS_COUNT } from 'src/__fixtures__/consts'
import { createTestRef } from 'src/__fixtures__/utils'

import { TEST_TAB_TITLE_TEST_ID } from './__fixtures__/consts'
import { renderTabTitle } from './__fixtures__/utils'

describe('tabTitle', () => {
  it('рендер по умолчанию', () => {
    renderTabTitle()

    const tabTitleElement = screen.getByTestId(TEST_TAB_TITLE_TEST_ID)

    expect(tabTitleElement).toMatchSnapshot()
  })

  it('параметр `isDisabled` добавляет соответствующее имя класса', () => {
    renderTabTitle({ isDisabled: true })

    const tabTitleElement = screen.getByTestId(TEST_TAB_TITLE_TEST_ID)

    expect(tabTitleElement).toHaveClass('isDisabled')
  })

  it('параметр `badgeCounterProps` добавляет бейдж для таба', () => {
    renderTabTitle({ badgeCounterProps: { count: TEST_ITEMS_COUNT, 'data-testid': 'tabs-title-badge-counter' } })

    const badgeCounterElement = screen.getByTestId('tabs-title-badge-counter')

    expect(badgeCounterElement).toBeInTheDocument()
  })

  it('параметр `icon` добавляет иконку', () => {
    renderTabTitle({ icon: 'bike' })

    expect(screen.getByTestId('tab-title-icon')).toBeInTheDocument()
  })

  it('обработчик `onClose` вызывается при нажатии на кнопку закрытия таба', async () => {
    renderTabTitle({ onClose: TEST_HANDLER })

    await userEvent.click(screen.getByRole('button'))

    expect(TEST_HANDLER).toHaveBeenCalledTimes(1)
  })

  it('параметр `ref` устанавливается и хранит ссылку на объект DOM элемента', () => {
    const ref = createTestRef<HTMLDivElement>()

    renderTabTitle({ ref })

    const tabTitleElement = screen.getByTestId(TEST_TAB_TITLE_TEST_ID)

    expect(tabTitleElement).toBe(ref.current)
  })

  it('параметр `closeButtonProps["aria-label"]` задаёт доступное имя кнопке закрытия', () => {
    renderTabTitle({ closeButtonProps: { 'aria-label': TEST_ARIA_LABEL }, onClose: TEST_HANDLER })

    const closeButtonElement = screen.getByLabelText(TEST_ARIA_LABEL)

    expect(closeButtonElement).toBeInTheDocument()
  })
})
