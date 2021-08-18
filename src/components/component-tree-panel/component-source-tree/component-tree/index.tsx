import React from 'react'
// import { useBetween } from 'use-between'
import { useMount } from 'ahooks'
import { CategoryTree } from './category-tree'
import { SearchResultList } from './search-result-list'
import styles from './index.module.less'
import { useBetween } from 'use-between'
import { useGuideAlgoComponentModel } from '../../../../models/guide-algo-component'

export const ComponentTree = () => {
  const { keyword, loadComponentNodes } = useBetween(useGuideAlgoComponentModel)

  useMount(() => {
    loadComponentNodes()
  })

  return (
    <div className={styles.componentTree}>
      {keyword ? <SearchResultList /> : <CategoryTree />}
    </div>
  )
}
