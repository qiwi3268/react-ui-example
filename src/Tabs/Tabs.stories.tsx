import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Tabs } from './Tabs'
import type { TabIdType } from './Tabs.types'
import { TAB_ID_STORY_ARG_TYPES } from './__storybook__/consts'
import { getStoryTabsChildren } from './__storybook__/utils'

export default {
  title: 'Page Structure/Tabs',
  component: Tabs,
  argTypes: {
    children: {
      control: false,
    },
    onTabClick: {
      control: false,
      description: 'Обработчик переключения табов',
    },
    activeTabId: {
      control: false,
      description: 'Задаёт id активного таба',
      ...TAB_ID_STORY_ARG_TYPES,
    },
    defaultTabId: {
      control: false,
      description: 'Задаёт id дефолтного таба',
      ...TAB_ID_STORY_ARG_TYPES,
    },
  },
  args: {
    children: getStoryTabsChildren(),
    defaultTabId: 'tab1',
  },
  tags: ['no-adaptive-docs', '[{"width":"320"},{"width":"672"},{"width":"1056"},{"width":"1312"}]'],
  render: ({ children, ...props }) => <Tabs {...props}>{children}</Tabs>,
} as Meta<typeof Tabs>

export const Default = {}

const Template: StoryFn<typeof Tabs> = ({ children, isFluid }) => {
  const [activeTabId, setActiveTabId] = useState<TabIdType>('tab1')

  return (
    <Tabs activeTabId={activeTabId} isFluid={isFluid} onTabClick={setActiveTabId}>
      {children}
    </Tabs>
  )
}

export const ControlledTabs: StoryObj<typeof Tabs> = {
  render: Template,
}

export const WithScroll: StoryObj<typeof Tabs> = {
  args: {
    children: getStoryTabsChildren(20),
  },
}

export const FluidWithScroll: StoryObj<typeof Tabs> = {
  args: {
    isFluid: true,
    children: getStoryTabsChildren(8),
  },
}
