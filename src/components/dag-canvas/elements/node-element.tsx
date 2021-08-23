import React from "react";
import { Node } from "@antv/x6";
import classNames from "classnames";
import { ConfigProvider } from "antd";
import { filter, map } from "rxjs/operators";
import { DatabaseFilled } from "@ant-design/icons";
import { NodePopover } from "../../common/graph-common/node-popover";
import { NodeStatus } from "../../common/graph-common/node-status";
import { useExperimentGraph } from "../../../rx-models/experiment-graph";
import { NExecutionStatus } from "../../../rx-models/typing";
import { ANT_PREFIX } from "../../../constants/global";
import { useObservableState } from "../../../hooks/useObservableState";
import styles from "./node-element.module.less";

interface Props {
  experimentId: string;
  node?: Node;
}

export const NodeElement: React.FC<Props> = (props) => {
  const { experimentId, node } = props;
  const experimentGraph = useExperimentGraph(experimentId);
  const [instanceStatus] = useObservableState(
    () =>
      experimentGraph.executionStatus$.pipe(
        filter((x) => !!x),
        map((x: any) => x.execInfo)
      ),
    {} as NExecutionStatus.ExecutionStatus["execInfo"]
  );
  const data: any = node?.getData() || {};
  const { name, id, selected } = data;
  const nodeStatus: any = instanceStatus[id] || {};


  console.log('==============', name, id, selected);
  

  return (
    <ConfigProvider prefixCls={ANT_PREFIX}>
      <NodePopover status={nodeStatus}>
        <div
          className={classNames(styles.nodeElement, {
            [styles.selected]: !!selected,
          })}
        >
          <div className={styles.icon}>
            <DatabaseFilled style={{ color: "#1890ff" }} />
          </div>
          <div className={styles.notation}>
            <div className={styles.name}>{name}</div>
            {nodeStatus.jobStatus && (
              <NodeStatus
                className={styles.statusIcon}
                status={nodeStatus.jobStatus as any}
              />
            )}
          </div>
        </div>
      </NodePopover>
    </ConfigProvider>
  );
};
