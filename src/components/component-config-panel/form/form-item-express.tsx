import { Form, Mentions, Tag } from "antd";
import { OptionProps } from "antd/lib/mentions";
import React, { useEffect, useState } from "react";
import { debounce } from "lodash-es";
export interface FormItemExpressProps {
  node;
  sourceNodes;
}

export default function FormItemExpress(props: FormItemExpressProps) {
  const [displayExpression, setDisplayExpression] = useState(""); //公式的展示
  const [prefix, setPrefix] = useState("#");
  const [loading, setLoading] = useState(false);
  const [lastSelect, setLastSelect] = useState({});
  const [expressOptions, setExpressOptions] = useState() as any;

  const { node, sourceNodes } = props;

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

  //   let sourceNodes = expGraph.findSourceByNode(nodeId);

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
      setExpressOptions(sourceNodes);
    }
  }, [node]);

  const onSearch = (text: string, prefix: string) => {
    setPrefix(prefix);
    setLoading(true);
    loadExpressOptions(prefix);
  };

  const onSelect = (option: OptionProps, prefix: string) => {
    setLastSelect({ prefix, option }); //存储当前选项
  };

  const onChange = (text: string) => {
    replaceNodeIdToName(text);
  };

  const loadExpressOptions = debounce((prefix) => {
    if (!prefix) {
      setExpressOptions([]);
      setLoading(false);
      return;
    }
    if (prefix === "#") {
      setExpressOptions(sourceNodes);
      setLoading(false);
      return;
    }
    if (prefix === ".") {
      if (lastSelect && lastSelect["prefix"] === "#") {
        setExpressOptions([
          { id: "options1", name: "option1" },
          { id: "options2", name: "option2" },
        ]);
      } else {
        setExpressOptions([]);
      }
      setLoading(false);
      return;
    }
  }, 800);
  return (
    <div>
      <Form.Item name="express" label="计算公式">
        <Mentions
          rows={3}
          prefix={[".", "#"]}
          onSearch={onSearch}
          onSelect={onSelect}
          loading={loading}
          onChange={onChange}
        >
          {expressOptions?.map(({ id, name }) => (
            <Mentions.Option
              value={prefix === "#" ? `s_${id}` : `${id}`}
              key={id}
            >
              {name}
            </Mentions.Option>
          ))}
        </Mentions>
      </Form.Item>
      <div>{renderExpression(displayExpression)}</div>
    </div>
  );
}
