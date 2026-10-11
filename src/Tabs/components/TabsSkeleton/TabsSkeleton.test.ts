import { getFirstElement } from 'web/react-libs'
import { describe, expect, it } from 'vitest'

import { renderTabsSkeleton } from './__fixtures__/utils'

describe('tabsSkeleton', () => {
  it('рендер по умолчанию', () => {
    const skeletonElement = getFirstElement(renderTabsSkeleton())

    expect(skeletonElement).toMatchSnapshot()
  })

  it('параметр `count` задаёт число элементов', () => {
    const skeletonElement = getFirstElement(renderTabsSkeleton({ count: 1 }))

    expect(skeletonElement).toMatchSnapshot()
  })
})
