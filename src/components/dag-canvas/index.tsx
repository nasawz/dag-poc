import React, { useEffect } from 'react'
import classNames from 'classnames'


import styles from './index.module.less'

interface Props {
  experimentId: string
  className?: string
}

export const DAGCanvas: React.FC<Props> = (props) => {
  const { experimentId, className } = props
//   const expGraph = useExperimentGraph(experimentId)

//   // 处理画布卸载
//   useUnmountExperimentGraph(experimentId)

//   // 自定义算法组件的渲染控制
//   useEffect(() => {
//     ;(window as any).renderForm = expGraph.setActiveAlgoData
//     return () => {
//       delete (window as any).renderForm
//     }
//   }, [expGraph])

  return (
    <div className={classNames(styles.dagContainer, className)}>
      {/* <CanvasToolbar experimentId={experimentId} />
      <CanvasContent
        experimentId={experimentId}
        className={styles.canvasContent}
      />
      <BottomToolbar experimentId={experimentId} /> */}
    </div>
  )
}
