import { getFirstElement } from 'web/react-libs'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { TEST_CONTENT_TEXT, TEST_HANDLER, TEST_TITLE } from 'src/__fixtures__/consts'
import { findElementByText } from 'src/__fixtures__/utils'

import { renderTabs } from './__fixtures__/utils'

describe('tabs', () => {
  it('рендер по умолчанию', () => {
    const tabsElement = getFirstElement(renderTabs({ defaultTabId: 1 }))

    expect(tabsElement).toMatchSnapshot()
  })

  it('параметр `defaultTabId` устанавливает дефолтный таб', () => {
    const tabsElement = getFirstElement(renderTabs({ defaultTabId: 2 }))

    expect(tabsElement).toMatchSnapshot()
  })

  it('клик на таб добавляет класс `isActive` и отображается контент только активного таба', async () => {
    const tabsElement = getFirstElement(getFirstElement(renderTabs({ defaultTabId: 1 })))

    await userEvent.click(tabsElement)

    expect(tabsElement).toHaveClass('isActive')
    expect(findElementByText(`${TEST_CONTENT_TEXT}-1`)).toBeInTheDocument()
    expect(findElementByText(`${TEST_CONTENT_TEXT}-2`)).not.toBeInTheDocument()
  })

  it('параметр `onTabClick` вызывается при изменении активного таба', async () => {
    renderTabs({ activeTabId: 1, onTabClick: TEST_HANDLER })

    await userEvent.click(screen.getByText(`${TEST_TITLE}-2`))

    expect(TEST_HANDLER).toHaveBeenCalledTimes(1)
    expect(TEST_HANDLER).toHaveBeenCalledExactlyOnceWith(2)
  })

  it('параметр `onTabClick` не вызывается, если выбранный таб уже является активным', async () => {
    renderTabs({ activeTabId: 2, onTabClick: TEST_HANDLER })

    await userEvent.click(screen.getByText(`${TEST_TITLE}-2`))

    expect(TEST_HANDLER).not.toHaveBeenCalled()
  })

  it('если нет параметра `activeTabId`, то компонент использует локальный стейт для переключения табов', async () => {
    renderTabs({ defaultTabId: 1 })

    await userEvent.click(screen.getByText(`${TEST_TITLE}-2`))

    expect(findElementByText(`${TEST_CONTENT_TEXT}-2`)).toBeInTheDocument()
    expect(findElementByText(`${TEST_CONTENT_TEXT}-1`)).not.toBeInTheDocument()
  })

  it('параметр `isFluid` расширяет табы на всю ширину контейнера', () => {
    const tabsElement = getFirstElement(renderTabs({ defaultTabId: 1, isFluid: true }))

    expect(tabsElement).toMatchSnapshot()
  })
})
