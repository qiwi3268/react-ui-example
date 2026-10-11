import { getFirstElement } from 'web/react-libs'
import { describe, expect, it } from 'vitest'

import styles from './TabContent.module.scss'
import { renderTabContent } from './__fixtures__/utils'

describe('tabContent', () => {
  it('рендер по умолчанию', () => {
    const tabContentElement = getFirstElement(renderTabContent())

    expect(tabContentElement).toMatchSnapshot()
  })

  it('параметр `withPaddings` добавляет соответствующий класс', () => {
    const tabContentElement = getFirstElement(renderTabContent({ withPaddings: true }))

    expect(tabContentElement).toHaveClass(styles.withPaddings!)
  })
})
