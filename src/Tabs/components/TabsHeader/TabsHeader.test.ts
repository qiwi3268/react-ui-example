import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TEST_CLASS_NAME } from 'src/__fixtures__/consts'
import { createTestRef } from 'src/__fixtures__/utils'

import { TEST_TABS_HEADER_TEST_ID } from './__fixtures__/consts'
import { renderTabsHeader } from './__fixtures__/utils'

describe('tabsHeader', () => {
  it('рендер по умолчанию', () => {
    renderTabsHeader()

    const tabsElement = screen.getByTestId(TEST_TABS_HEADER_TEST_ID)

    expect(tabsElement).toMatchSnapshot()
  })

  it('параметр `withBorder` добавляет соответствующее имя класса', () => {
    renderTabsHeader({ withBorder: true })

    const tabsElement = screen.getByTestId(TEST_TABS_HEADER_TEST_ID)

    expect(tabsElement).toHaveClass('withBorder')
  })

  it('параметр `className` имя класса', () => {
    renderTabsHeader({ className: TEST_CLASS_NAME })

    const tabsElement = screen.getByTestId(TEST_TABS_HEADER_TEST_ID)

    expect(tabsElement).toHaveClass(TEST_CLASS_NAME)
  })

  it('параметр `ref` устанавливается и хранит ссылку на объект DOM элемента', () => {
    const ref = createTestRef<HTMLDivElement>()

    renderTabsHeader({ ref })

    const tabsElement = screen.getByTestId(TEST_TABS_HEADER_TEST_ID)

    expect(tabsElement).toBe(ref.current)
  })
})
