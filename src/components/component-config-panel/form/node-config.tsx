import React from "react";
import { Divider, Form, Input } from "antd";
import { keys, map } from "lodash-es";
// import { useExperimentGraph } from '@/pages/rx-models/experiment-graph'
import "antd/lib/style/index.css";
import { useObservableState } from "../../../hooks/useObservableState";
import { useExperimentGraph } from "../../../rx-models/experiment-graph";

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
  console.log("[activeNodeInstance]", node);

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

  // console.log("nodeId============================>>>", nodeId);
  let sourceNodes = expGraph.findSourceByNode(nodeId);
  console.log(sourceNodes, "=======");

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
      <Form.Item label="表.字段" name="table_field">
        <Input placeholder="input placeholder" />
      </Form.Item>
      {/* <Form.Item label={name}>
        <Input placeholder="input placeholder" />
      </Form.Item>
      
      <Form.Item label="Field D">
        <Input placeholder="input placeholder" />
      </Form.Item> */}
    </Form>
  );
};
