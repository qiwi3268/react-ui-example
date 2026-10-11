import { TABS_MODE_CONTROLLED, TABS_MODE_UNCONTROLLED } from './Tabs.consts'
import type { CheckIfTabsModeChangedUtilType, GetTabsModeUtilType, TabIdType } from './Tabs.types'

export const getTabsMode: GetTabsModeUtilType = (activeTabId?: TabIdType) => {
  return activeTabId ? TABS_MODE_CONTROLLED : TABS_MODE_UNCONTROLLED
}

export const checkIfTabsModeChanged: CheckIfTabsModeChangedUtilType = (tabsMode, activeTabId) => {
  return tabsMode !== getTabsMode(activeTabId)
}
