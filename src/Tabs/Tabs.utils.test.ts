import { describe, expect, it } from 'vitest'

import { TABS_MODE_CONTROLLED, TABS_MODE_UNCONTROLLED } from './Tabs.consts'
import { checkIfTabsModeChanged, getTabsMode } from './Tabs.utils'

describe('`Tabs` утилиты', () => {
  describe(`getTabsMode`, () => {
    it('возвращает режим `controlled` при наличии `activeTabId', () => {
      expect(getTabsMode('tab1')).toBe(TABS_MODE_CONTROLLED)
    })

    it('возвращает режим `uncontrolled` при отсутствии `activeTabId', () => {
      expect(getTabsMode(undefined)).toBe(TABS_MODE_UNCONTROLLED)
    })
  })

  describe(`checkIfTabsModeChanged`, () => {
    it('возвращает `false`, если режим табов не изменился', () => {
      expect(checkIfTabsModeChanged(TABS_MODE_CONTROLLED, 'tab2')).toBe(false)
    })

    it('возвращает `true`, если режим табов изменился', () => {
      expect(checkIfTabsModeChanged(TABS_MODE_CONTROLLED, undefined)).toBe(true)
    })
  })
})
