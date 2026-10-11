import type { Meta } from '@storybook/react-vite'

import { STORY_PREV_NEXT_BUTTON_PROPS, STORY_REACT_ELEMENT_ARG_TYPE } from 'src/__storybook__/consts'
import { getStoryArgTypes } from 'src/__storybook__/utils'

import { Tabs } from '../../Tabs'
import { getStoryTabsHeader } from '../../__storybook__/utils'

import { TabsHeader } from './TabsHeader'

export default {
  title: 'Page Structure/Tabs',
  component: TabsHeader,
  argTypes: {
    children: {
      control: false,
      ...STORY_REACT_ELEMENT_ARG_TYPE,
    },
    ...STORY_PREV_NEXT_BUTTON_PROPS,
    ...getStoryArgTypes(['ref']),
  },
  args: {
    children: getStoryTabsHeader(),
  },
  decorators: [
    (Story) => (
      <Tabs defaultTabId={1}>
        <Story />
      </Tabs>
    ),
  ],
  tags: ['[{"width":"320"},{"width":"672"},{"width":"1056"},{"width":"1312"}]'],
} as Meta<typeof TabsHeader>

export const WithTabsHeader = {}
