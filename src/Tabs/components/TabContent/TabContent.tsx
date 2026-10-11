import classnames from 'classnames'
import { type ReactElement, cloneElement, memo } from 'react'

import { useGetActiveTab } from '../TabsContext'

import styles from './TabContent.module.scss'
import type { TabContentPropsType } from './TabContent.types'

/**
 * Компонент, отображающий контент таба
 */
export const TabContent = memo(({ children, tabId, withPaddings }: TabContentPropsType) => {
  const activeTab = useGetActiveTab()
  const isShow = activeTab === tabId

  const child = children as ReactElement<{ className?: string }>

  return isShow
    ? // eslint-disable-next-line @eslint-react/no-clone-element -- cloneElement инжектит className с withPaddings в дочерний элемент, альтернатива потребует изменения API
      cloneElement(child, {
        className: classnames(child.props.className, {
          [styles.withPaddings!]: withPaddings,
        }),
      })
    : null
})

TabContent.displayName = 'TabContent'
