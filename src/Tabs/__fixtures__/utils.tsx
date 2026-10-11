import { render } from '@testing-library/react'

import { TEST_CONTENT_TEXT, TEST_TITLE } from 'src/__fixtures__/consts'

import { Tabs } from '../Tabs'
import type { TabsPropsType } from '../Tabs.types'
import { TabContent } from '../components/TabContent'
import { TabTitle } from '../components/TabTitle'
import { TabsHeader } from '../components/TabsHeader'

import type { RenderTabsUtilType } from './types'

export const renderTabs: RenderTabsUtilType = ({
  children = (
    <>
      <TabsHeader withBorder>
        <TabTitle tabId={1} title={`${TEST_TITLE}-1`} />
        <TabTitle tabId={2} title={`${TEST_TITLE}-2`} />
      </TabsHeader>
      <TabContent tabId={1}>
        <div>{`${TEST_CONTENT_TEXT}-1`}</div>
      </TabContent>
      <TabContent tabId={2}>
        <div>{`${TEST_CONTENT_TEXT}-2`}</div>
      </TabContent>
    </>
  ),
  ...props
} = {}) => {
  return render(<Tabs {...(props as TabsPropsType)}>{children}</Tabs>)
}
