import type { InputType } from 'storybook/internal/csf'

export const TAB_ID_STORY_ARG_TYPES: InputType = {
  table: {
    type: {
      summary: 'number | string',
    },
  },
}

export const SOURCE_CODE_UNCONTROLLED = `
const tabs: TabTitlePropsType[] = [
  ...
  {
    tabId: 'tab2',
    title: 'Заголовок-2',
    icon: 'bike',
    badgeCounterProps: {
      count: 9,
      kind: 'primary',
      type: 'success',
    },
    onClose={...}
  },
  ...
]

return (
  <Tabs defaultTabId='tab1'>
    <TabsHeader withBorder>
      {tabs.map((tab) => (
        <TabTitle {...tab} />
      ))}
    </TabsHeader>
    <TabContent withPaddings tabId='tab1'>
      <Text>Пример текста - 1</Text>
    </TabContent>
    ...
  </Tabs>
)
`

export const SOURCE_CODE_CONTROLLED = `
const [activeTabId, setActiveTabId] = useState<TabIdType>('tab1')
const tabs: TabTitlePropsType[] = [
  ...
  {
    tabId: 'tab2',
    title: 'Заголовок-2',
    icon: 'bike',
    badgeCounterProps: {
      count: 9,
      kind: 'primary',
      type: 'success',
    },
    onClose={...}
  },
  ...
]

return (
  <Tabs activeTabId={activeTabId} onTabClick={setActiveTabId}>
    <TabsHeader withBorder>
      {tabs.map((tab) => (
        <TabTitle {...tab} />
      ))}
    </TabsHeader>
    <TabContent withPaddings tabId='tab1'>
      <Text>Пример текста - 1</Text>
    </TabContent>
    ...
  </Tabs>
)
`
