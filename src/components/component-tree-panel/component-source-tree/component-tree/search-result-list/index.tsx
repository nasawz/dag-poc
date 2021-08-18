import React, { useCallback } from 'react'
import { Spin } from 'antd'
import { ProfileTwoTone } from '@ant-design/icons'

import { ComponentItem } from './component-item'
import styles from './index.module.less'
import { useBetween } from 'use-between'
import { useGuideAlgoComponentModel } from '../../../../../models/guide-algo-component'

export const SearchResultList = () => {
  const { keyword, searchList, loading } = useBetween(useGuideAlgoComponentModel)

  const renderList = useCallback((list: any[], keywd: string) => {
    return (
      <ul className={styles.searchList}>
        {list.map((component, idx) => (
          <li key={idx.toString()}>
            <ComponentItem data={{ ...component, keyword: keywd }} />
          </li>
        ))}
      </ul>
    )
  }, [])

  const renderEmptyResult = useCallback(() => {
    return (
      <>
        <p className={styles.resultTips}>
          <ProfileTwoTone />
          {'没有搜索结果'}
        </p>
      </>
    )
  }, [])

  return (
    <Spin spinning={loading}>
      <div className="tree-wrapper">
        {searchList.length
          ? renderList(searchList, keyword)
          : renderEmptyResult()}
      </div>
    </Spin>
  )
}
