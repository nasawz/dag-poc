import React from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { useExperimentGraph } from '../../../rx-models/experiment-graph'
import { useObservableState } from '../../../hooks/useObservableState'

interface Props {
  className?: string
  experimentId: string
}

export const GraphRunningStatus: React.FC<Props> = (props) => {
  const { className, experimentId } = props
  const experimentGraph = useExperimentGraph(experimentId)
  const [executionStatus]: any = useObservableState(
    () => experimentGraph.executionStatus$,
  )

  return (
    <div className={className}>
      {executionStatus?.status === 'preparing' && (
        <>
          <LoadingOutlined style={{ marginRight: 4 }} /> 准备中...
        </>
      )}
    </div>
  )
}
