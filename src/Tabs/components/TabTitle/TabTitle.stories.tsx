import type { Meta } from '@storybook/react-vite'

import { getDeepControlArgTypes } from 'src/__storybook__'
import { BADGE_COUNTER_ARG_TYPES, STORY_CLOSE_BUTTON_PROPS, STORY_HANDLER, STORY_TITLE } from 'src/__storybook__/consts'

import { Tabs } from '../../Tabs'
import { TAB_ID_STORY_ARG_TYPES } from '../../__storybook__/consts'
import { TabsHeader } from '../TabsHeader'

import { TabTitle } from './TabTitle'

export default {
  title: 'Page Structure/Tabs',
  component: TabTitle,
  argTypes: {
    tabId: {
      control: false,
      ...TAB_ID_STORY_ARG_TYPES,
    },
    ...STORY_CLOSE_BUTTON_PROPS,
    ...getDeepControlArgTypes('badgeCounterProps', BADGE_COUNTER_ARG_TYPES),
  },
  parameters: {
    controls: {
      exclude: ['badgeCounterProps'],
    },
  },
  decorators: [
    (Story) => (
      <Tabs defaultTabId={1}>
        <TabsHeader>
          <Story />
          <Story args={{ tabId: 2, title: `${STORY_TITLE}-2` }} />
        </TabsHeader>
      </Tabs>
    ),
  ],
  tags: ['[{"width":"320"},{"width":"672"},{"width":"1056"},{"width":"1312"}]'],
  args: {
    tabId: 1,
    title: `${STORY_TITLE}-1`,
    onClose: STORY_HANDLER,
  },
} as Meta<typeof TabTitle>

export const WithTabTitle = {}
