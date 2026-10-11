import { render } from '@testing-library/react'

import { TEST_ITEMS_COUNT } from 'src/__fixtures__/consts'

import { TabsSkeleton } from '../TabsSkeleton'

import type { RenderTabsSkeletonUtilType } from './types'

export const renderTabsSkeleton: RenderTabsSkeletonUtilType = ({ count = TEST_ITEMS_COUNT } = {}) =>
  render(<TabsSkeleton count={count} />)
