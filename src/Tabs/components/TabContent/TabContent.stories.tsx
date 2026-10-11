import type { Meta } from '@storybook/react-vite'

import { STORY_CHILDREN, STORY_REACT_ELEMENT_ARG_TYPE, STORY_TITLE } from 'src/__storybook__/consts'
import { Text } from 'src/components/design-system/Text'

import { Tabs } from '../../Tabs'
import { TAB_ID_STORY_ARG_TYPES } from '../../__storybook__/consts'
import { TabTitle } from '../TabTitle'
import { TabsHeader } from '../TabsHeader'

import { TabContent } from './TabContent'

export default {
  title: 'Page Structure/Tabs',
  component: TabContent,
  argTypes: {
    children: {
      control: false,
      ...STORY_REACT_ELEMENT_ARG_TYPE,
    },
    tabId: {
      ...TAB_ID_STORY_ARG_TYPES,
    },
  },
  args: {
    children: <Text>{`${STORY_CHILDREN} - 1`}</Text>,
    tabId: 1,
    withPaddings: true,
  },
  tags: ['[{"width":"320"},{"width":"672"},{"width":"1056"},{"width":"1312"}]'],
  decorators: [
    (Story) => (
      <Tabs defaultTabId={1}>
        <TabsHeader>
          <TabTitle tabId={1} title={`${STORY_TITLE}-1`} />
          <TabTitle tabId={2} title={`${STORY_TITLE}-2`} />
        </TabsHeader>
        <Story />
        <Story args={{ tabId: 2, children: <Text>{`${STORY_CHILDREN} - 2`}</Text>, withPaddings: true }} />
      </Tabs>
    ),
  ],
} as Meta<typeof TabContent>

export const WithTabContent = {}
