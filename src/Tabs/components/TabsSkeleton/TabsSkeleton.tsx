import { generateArray } from 'web/libs'
import { memo } from 'react'

import { Flex } from 'src/components/design-system/Flex'
import { Skeleton } from 'src/components/design-system/Skeleton'

import styles from './TabsSkeleton.module.scss'
import type { TabsSkeletonPropsType } from './TabsSkeleton.types'

/**
 * Компонент, отображающий скелетон для компонента `Tabs`
 */
export const TabsSkeleton = memo(({ count, ...props }: TabsSkeletonPropsType) => (
  <Flex {...props} aria-hidden="true" className={styles.TabsSkeleton}>
    {generateArray(count, (i) => (
      <Flex alignItems="center" className={styles.TabSkeleton} key={i}>
        <Skeleton className={styles.Skeleton} />
      </Flex>
    ))}
  </Flex>
))

TabsSkeleton.displayName = 'TabsSkeleton'
