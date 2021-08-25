import React, { useState } from "react";
import { Layout, Button } from "antd";
// import { useObservableState } from '@/common/hooks/useObservableState'
// import { useExperimentGraph } from '@/pages/rx-models/experiment-graph'
import { GithubOutlined } from "@ant-design/icons";
import { SimpleLogo } from "./logo";
import { ExperimentTitle } from "./experiment-title";

import css from "./index.module.less";
import { useExperimentGraph } from "../../rx-models/experiment-graph";
import { useObservableState } from "../../hooks/useObservableState";
import { emitter } from "../../constants/emitter";
const { Header } = Layout;

interface IProps {
  experimentId: string;
}
export const GuideHeader: React.FC<IProps> = (props) => {
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const expGraph = useExperimentGraph(props.experimentId);
  const [activeExperiment] = useObservableState(expGraph.experiment$);

  const onSave = () => {
    expGraph.saveExperimentGraph();
  }
  emitter.addListener('onChangeGraph', function (staus) {
    setDisabled(staus);
    if (staus === true) {
      setLoading(false);
    }
  });
  emitter.addListener('saveLoading', function () {
    setLoading(true);
  });
  return (
    <>
      <Header className={css.header}>
        <div className={css.headerLeft}>
          <SimpleLogo />
          {activeExperiment && <ExperimentTitle experimentName={activeExperiment.name} />}
        </div>
        <div className={css.headerRight}>
          <div className={css.doc}>
            <Button type="primary" onClick={onSave} disabled={disabled} loading={loading}>保存</Button>
          </div>
        </div>
      </Header>
    </>
  );
};
