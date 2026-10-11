import type { Meta } from '@storybook/react-vite'

import { STORY_DEFAULT_ITEMS_COUNT } from 'src/__storybook__/consts'

import { TabsSkeleton } from './TabsSkeleton'

export default {
  title: 'Page Structure/Tabs',
  component: TabsSkeleton,
  args: {
    count: STORY_DEFAULT_ITEMS_COUNT,
  },
  tags: ['[{"width":"320"},{"width":"672"},{"width":"1056"},{"width":"1312"}]'],
} as Meta<typeof TabsSkeleton>

export const WithTabsSkeleton = {}
