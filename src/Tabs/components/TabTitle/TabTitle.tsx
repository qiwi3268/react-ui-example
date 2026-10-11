import classnames from 'classnames'
import { type MouseEventHandler, memo, use, useCallback, useMemo } from 'react'

import { BadgeCounter } from 'src/components/design-system/BadgeCounter'
import { CloseButton } from 'src/components/design-system/CloseButton'
import { Flex } from 'src/components/design-system/Flex'
import { Icon } from 'src/components/design-system/Icon'
import { Text } from 'src/components/design-system/Text'

import { useGetActiveTab, useGetIsFluid, useGetOnTabClick } from '../TabsContext'
import { TabsScrollContext } from '../TabsScrollContext'

import { DEFAULT_CLOSE_BUTTON_PROPS } from './TabTitle.consts'
import styles from './TabTitle.module.scss'
import type { TabTitlePropsType } from './TabTitle.types'

/**
 * Компонент, отображающий заголовок таба
 */
export const TabTitle = memo(
  ({
    title,
    tabId,
    isDisabled,
    badgeCounterProps,
    onClose,
    icon,
    closeButtonProps = DEFAULT_CLOSE_BUTTON_PROPS,
    ref,
    ...rest
  }: TabTitlePropsType) => {
    const activeTab = useGetActiveTab()
    const onTabClick = useGetOnTabClick()
    const isFluid = useGetIsFluid()
    const ensureVisible = use(TabsScrollContext)

    const isActive = activeTab === tabId
    const tabIndex = isDisabled ? -1 : 0

    const color = useMemo(() => {
      if (isDisabled) {
        return 'disabled'
      }

      if (isActive) {
        return 'primary'
      }

      return 'secondary'
    }, [isDisabled, isActive])

    const handleClick: MouseEventHandler<HTMLDivElement> = useCallback(
      (event) => {
        if (!isDisabled) {
          ensureVisible?.(event.currentTarget)
          onTabClick(tabId)
        }
      },
      [ensureVisible, isDisabled, onTabClick, tabId],
    )

    const handleClose: MouseEventHandler<HTMLButtonElement> = useCallback(
      (event) => {
        event.stopPropagation()

        onClose?.(event, tabId)
      },
      [onClose, tabId],
    )

    return (
      <Flex
        {...rest}
        alignItems="center"
        className={classnames(styles.Tab, {
          [styles.isActive!]: isActive,
          [styles.isDisabled!]: isDisabled,
          [styles.isFluid!]: isFluid,
        })}
        justifyContent="center"
        ref={ref}
        space={2}
        tabIndex={tabIndex}
        onClick={handleClick}
      >
        {!!icon && (
          <Icon
            aria-hidden="true"
            color={isDisabled ? 'disabled' : undefined}
            data-testid="tab-title-icon"
            name={icon}
          />
        )}
        <Text color={color}>{title}</Text>
        {badgeCounterProps && <BadgeCounter {...badgeCounterProps} />}
        {onClose && <CloseButton isDisabled={isDisabled} size="small" onClick={handleClose} {...closeButtonProps} />}
      </Flex>
    )
  },
)

TabTitle.displayName = 'TabTitle'
