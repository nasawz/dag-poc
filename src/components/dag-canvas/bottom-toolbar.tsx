import React, { useCallback, useEffect, useState } from "react";
import { message, Popover } from "antd";
import {
  CloudUploadOutlined,
  LogoutOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import classNames from "classnames";
import styles from "./bottom-toolbar.module.less";
import { useExperimentGraph } from "../../rx-models/experiment-graph";
import { useObservableState } from "../../hooks/useObservableState";

interface Props {
  experimentId: string;
}

export const BottomToolbar: React.FC<Props> = (props) => {
  const { experimentId } = props;
  const expGraph = useExperimentGraph(experimentId);
  const [running] = useObservableState(expGraph.running$);
  const [preparingRun, setPreparingRun] = useState(false);
  const [preparingStop, setPreparingStop] = useState(false);

  // running 的值发生变化，说明运行或停止按钮的操作产生了作用
  useEffect(() => {
    setPreparingRun(false);
    setPreparingStop(false);
  }, [running]);

  // 运行实验
  const onRunExperiment = useCallback(() => {
    setPreparingRun(true);
    expGraph.runGraph().then((res: any) => {
      if (!res.success) {
        message.error("运行失败");
        setPreparingRun(false);
      } else {
        message.success("运行成功");
      }
    });
  }, [expGraph]);

  // 停止运行
  const onStopRunExperiment = useCallback(() => {
    setPreparingStop(true);
    expGraph.stopRunGraph().then((res: any) => {
      if (!res.success) {
        setPreparingStop(false);
      }
    });
  }, [expGraph]);

  // 部署
  const deployExperiment = useCallback(() => {
    expGraph.deployGraph().then((res: any) => {
      if (!res.success) {
        message.error("部署失败");
      } else {
        message.success("已部署");
      }
    });
  }, [expGraph]);

  const runningConfigs = [
    {
      content: "运行",
      tip: "依次运行本实验的每个组件",
      icon: PlayCircleOutlined,
      disabled: preparingRun,
      clickHandler: onRunExperiment,
    },
    {
      content: "停止",
      tip: "停止运行实验",
      icon: LogoutOutlined,
      disabled: preparingStop,
      clickHandler: onStopRunExperiment,
    },
  ];

  const runningConfig = runningConfigs[Number(!!running)];
  const RunningIcon = runningConfig.icon;

  return (
    <div className={styles.bottomToolbar}>
      <ul className={styles.itemList}>
        {/* 部署 */}
        <li className={styles.item} onClick={deployExperiment}>
          <CloudUploadOutlined />
          <span>部署</span>
        </li>

        {/* 运行/停止 */}
        <Popover content={runningConfig.tip} overlayClassName={styles.popover}>
          <li
            className={classNames(styles.item, {
              [styles.disabled]: runningConfig.disabled,
            })}
            onClick={runningConfig.clickHandler}
          >
            <RunningIcon />
            <span>{runningConfig.content}</span>
          </li>
        </Popover>
      </ul>
    </div>
  );
};
