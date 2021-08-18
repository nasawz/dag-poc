import React, { useCallback } from 'react'
// import { useBetween } from 'use-between'
import { Tree } from 'antd'
import { FolderFilled, FolderOpenFilled } from '@ant-design/icons'
import { NodeTitle } from './node-title'
import styles from './index.module.less'
import { useBetween } from 'use-between'
import { useGuideAlgoComponentModel } from '../../../../../models/guide-algo-component'

const { DirectoryTree, TreeNode } = Tree

const FolderIcon = ({ expanded }: { expanded: boolean }) => {
  return expanded ? <FolderOpenFilled /> : <FolderFilled />
}

export const CategoryTree = () => {
  const { componentTreeNodes } = useBetween(useGuideAlgoComponentModel)
  console.log('componentTreeNodes',componentTreeNodes);
  

  const renderTree = useCallback(
    (treeList: any[] = [], searchKey: string = '') => {
      return treeList.map((item) => {
        const { isDir, id, treeData } = item
        const key = id.toString()
        const title = <NodeTitle node={item} searchKey={searchKey} />

        if (isDir) {
          return (
            <TreeNode
              icon={FolderIcon}
              key={key}
              title={title}
              className={styles.treeFolder}
            >
              {renderTree(treeData, searchKey)}
            </TreeNode>
          )
        }

        return (
          <TreeNode
            isLeaf={true}
            key={key}
            icon={<span />}
            title={title}
            className={styles.treeNode}
          />
        )
      })
    },
    [],
  )

  const treeList = componentTreeNodes.filter((node) => node.status !== 4)
console.log('treeList',treeList);
console.log('----------',componentTreeNodes);

  return (
    <div className={styles.list}>
      <DirectoryTree
        showIcon={true}
        selectable={false}
        autoExpandParent={true}
        className={styles.tree}
        defaultExpandedKeys={['recentlyUsed']}
      >
        {renderTree(treeList)}
      </DirectoryTree>
    </div>
  )
}
