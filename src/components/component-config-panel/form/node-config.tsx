import React from "react";
import { Divider, Form, Input, InputNumber } from "antd";
import { keys, map } from "lodash-es";
// import { useExperimentGraph } from '@/pages/rx-models/experiment-graph'
import "antd/lib/style/index.css";
import { useObservableState } from "../../../hooks/useObservableState";
import { useExperimentGraph } from "../../../rx-models/experiment-graph";
import FormItemExpress from "./form-item-express";

export interface Props {
  name: string;
  experimentId: string;
  nodeId: string;
}

export const NodeFormDemo: React.FC<Props> = ({
  name,
  nodeId,
  experimentId,
}) => {
  const [form] = Form.useForm();

  const expGraph = useExperimentGraph(experimentId);
  const [node] = useObservableState(() => expGraph.activeNodeInstance$);

  const onValuesChange = async ({ name, ...others }: { name: string }) => {
    if (name && node.name !== name) {
      await expGraph.renameNode(nodeId, name);
    }
    map(keys(others), async (key) => {
      if (node.data[key] !== others[key]) {
        await expGraph.updateNodeData(nodeId, { [key]: others[key] });
      }
    });
  };
  let getInitialValues = () => {
    let v = {} as any;
    if (node) {
      const { name, data } = node;
      v.name = name;

      map(keys(data), (key) => {
        v[key] = data[key];
      });
    }
    return v;
  };
  // codeName: "table_field"
  if (!node) {
    return <div />;
  }

  let sourceNodes = expGraph.findSourceByNode(nodeId);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={getInitialValues()}
      onValuesChange={onValuesChange}
      requiredMark={false}
    >
      <Form.Item label="节点名称" name="name">
        <Input placeholder="input placeholder" />
      </Form.Item>
      <Divider />
      {/* <Form.Item label="表.字段" name="table_field">
        <Input placeholder="input placeholder" />
      </Form.Item> */}

      {/* 公式 */}
      {node.codeName === "express" && (
        <FormItemExpress node={node} sourceNodes={sourceNodes} />
      )}

      {/* 系数 */}
      {node.codeName === "constant" && (
        <Form.Item name="constant" label="系数">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      )}
    </Form>
  );
};
