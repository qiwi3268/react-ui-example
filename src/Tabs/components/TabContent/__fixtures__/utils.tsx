import { render } from '@testing-library/react'

import { TEST_DEFAULT_TAB_ID, TEST_HANDLER } from 'src/__fixtures__/consts'
import { Tabs } from 'src/components/design-system/Tabs'

import { TabContent } from '../TabContent'

import { TEST_CHILDREN_TAB_CONTENT, TEST_ID_TAB_CONTENT } from './consts'
import type { RenderTabContentUtilType } from './types'

export const renderTabContent: RenderTabContentUtilType = ({
  tabId = TEST_ID_TAB_CONTENT,
  children = TEST_CHILDREN_TAB_CONTENT,
  ...props
} = {}) =>
  render(
    <Tabs activeTabId={TEST_DEFAULT_TAB_ID} onTabClick={TEST_HANDLER}>
      <TabContent tabId={tabId} {...props}>
        {children}
      </TabContent>
    </Tabs>,
  )
