import { generateArray } from 'web/libs'
import type { ReactElement } from 'react'

import {
  STORY_CHILDREN,
  STORY_COUNTER_VALUE,
  STORY_DEFAULT_ITEMS_COUNT,
  STORY_HANDLER,
  STORY_TITLE,
} from 'src/__storybook__/consts'
import { Text } from 'src/components/design-system/Text'

import { TabContent } from '../components/TabContent'
import { TabTitle } from '../components/TabTitle'
import { TabsHeader } from '../components/TabsHeader'

import type { GetStoryTabsItemsUtilType } from './types'

export const getStoryTabsHeader: GetStoryTabsItemsUtilType = (count = STORY_DEFAULT_ITEMS_COUNT) => {
  const disabledIndex = 3

  return (
    <>
      {generateArray(count, (index) => (
        <TabTitle
          badgeCounterProps={
            index === 1
              ? {
                  count: STORY_COUNTER_VALUE,
                  kind: 'primary',
                  type: 'success',
                }
              : undefined
          }
          icon={index === 1 || index === disabledIndex ? 'bike' : undefined}
          isDisabled={index === disabledIndex}
          key={index}
          tabId={`tab${index + 1}`}
          title={`${STORY_TITLE}-${index + 1}`}
          onClose={STORY_HANDLER}
        />
      ))}
    </>
  )
}

export const getStoryTabsChildren: GetStoryTabsItemsUtilType = (count = STORY_DEFAULT_ITEMS_COUNT) => (
  <>
    <TabsHeader withBorder>{getStoryTabsHeader(count) as ReactElement[]}</TabsHeader>
    {generateArray(count, (index) => (
      <TabContent withPaddings key={index} tabId={`tab${index + 1}`}>
        <Text>{`${STORY_CHILDREN} - ${index + 1}`}</Text>
      </TabContent>
    ))}
  </>
)
