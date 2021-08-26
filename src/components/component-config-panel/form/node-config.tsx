import React from "react";
import { Divider, Form, Input, InputNumber, Mentions, Row, Tag } from "antd";
import { keys, map } from "lodash-es";
// import { useExperimentGraph } from '@/pages/rx-models/experiment-graph'
import "antd/lib/style/index.css";
import { useObservableState } from "../../../hooks/useObservableState";
import { useExperimentGraph } from "../../../rx-models/experiment-graph";
import { useState } from "react";
import { useEffect } from "react";

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

  const [displayExpression, setDisplayExpression] = useState("");
  const expGraph = useExperimentGraph(experimentId);
  const [node] = useObservableState(() => expGraph.activeNodeInstance$);

  // 展示计算公式
  const renderExpression = (expression) => {
    if (!expression) {
      return "-";
    }
    const expressionTitle = expression;
    if (expression) {
      const expressionArr = expression.split(" ");
      return expressionArr.map((item, index) => {
        const patt = /([/#]{1})([\p{Unified_Ideograph}|\w(\/\w)?]+)/gu;
        if (patt.test(item)) {
          return (
            <Tag key={index} color="blue" style={{ marginBottom: 8 }}>
              {item}
            </Tag>
          );
        } else {
          return (
            <span key={index} style={{ marginRight: 8, marginBottom: 8 }}>
              {item}
            </span>
          );
        }
      });
    }
    return expressionTitle;
  };

  const onValuesChange = async ({ name, ...others }: { name: string }) => {
    //计算展示的expression
    if (others["express"] && node.codeName === "express") {
      replaceNodeIdToName(others["express"]);
    }

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

  const replaceNodeIdToName = (express) => {
    if (!express) {
      setDisplayExpression("");
      return;
    }
    let newStr = express;
    sourceNodes.forEach((item) => {
      newStr = newStr.replaceAll(item.id, item.name);
    });
    setDisplayExpression(newStr);
  };

  useEffect(() => {
    if (node && node.codeName === "express") {
      replaceNodeIdToName(node?.data?.express);
    }
  }, [node]);

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

      {/* 公式 */}
      {node.codeName === "express" && (
        <div>
          <Form.Item name="express" label="计算公式">
            <Mentions rows={3} prefix={["#"]}>
              {sourceNodes.map(({ id, name }) => (
                <Mentions.Option value={`s_${id}`} key={id}>
                  {name}
                </Mentions.Option>
              ))}
            </Mentions>
          </Form.Item>
          <div>{renderExpression(displayExpression)}</div>
        </div>
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
