import { render } from '@testing-library/react'

import { TEST_CHILDREN } from 'src/__fixtures__/consts'

import { TabsHeader } from '../TabsHeader'

import { TEST_TABS_HEADER_TEST_ID } from './consts'
import type { RenderTabsHeaderUtilType } from './types'

export const renderTabsHeader: RenderTabsHeaderUtilType = (props) =>
  render(
    <TabsHeader data-testid={TEST_TABS_HEADER_TEST_ID} {...props}>
      <div>{`${TEST_CHILDREN}-1`}</div>
      <div>{`${TEST_CHILDREN}-2`}</div>
    </TabsHeader>,
  )
