import { render } from '@testing-library/react'

import { TEST_DEFAULT_TAB_ID, TEST_HANDLER, TEST_TITLE } from 'src/__fixtures__/consts'
import { Tabs } from 'src/components/design-system/Tabs'

import { TabTitle } from '../TabTitle'

import { TEST_TAB_TITLE_TEST_ID } from './consts'
import type { RenderTabTitleUtilType } from './types'

export const renderTabTitle: RenderTabTitleUtilType = (props) =>
  render(
    <Tabs activeTabId={TEST_DEFAULT_TAB_ID} onTabClick={TEST_HANDLER}>
      <TabTitle data-testid={TEST_TAB_TITLE_TEST_ID} tabId={TEST_DEFAULT_TAB_ID} title={`${TEST_TITLE}-1`} {...props} />
    </Tabs>,
  )
