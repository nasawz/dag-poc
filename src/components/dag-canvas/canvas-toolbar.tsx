import React, { useCallback, useState } from "react";
import { Toolbar } from "@antv/x6-react-components/es/toolbar";
import "@antv/x6-react-components/es/toolbar/style/index.less";
import {
  GatewayOutlined,
  GroupOutlined,
  PlaySquareOutlined,
  RollbackOutlined,
  UngroupOutlined,
} from "@ant-design/icons";
import { BehaviorSubject } from "rxjs";
import { useExperimentGraph } from "../../rx-models/experiment-graph";
import { formatGroupInfoToNodeMeta } from "../../rx-models/graph-util";
import { addNodeGroup } from "../../mock/graph";
import { showModal } from "../modal";
import { useObservableState } from "../../hooks/useObservableState";
import { RxInput } from "../rx-component/rx-input";
import { BaseNode } from "../common/graph-common/shape/node";
import styles from "./canvas-toolbar.module.less";

const { Item, Group } = Toolbar;
interface Props {
  experimentId: string;
}

enum Operations {
  UNDO_DELETE = "UNDO_DELETE",
  GROUP_SELECT = "GROUP_SELECT",
  RUN_SELECTED = "RUN_SELECTED",
  NEW_GROUP = "NEW_GROUP",
  UNGROUP = "UNGROUP",
}

export const CanvasToolbar: React.FC<Props> = (props) => {
  const { experimentId } = props;
  const [selectionEnabled, setSelectionEnabled] = useState<boolean>(false);
  const expGraph = useExperimentGraph(experimentId);
  const [activeNodeInstance] = useObservableState(
    () => expGraph.activeNodeInstance$
  );
  const [selectedNodes]: any = useObservableState(
    () => expGraph.selectedNodes$
  );
  const [selectedGroup] = useObservableState(() => expGraph.selectedGroup$);

  const onClickItem = useCallback(
    (itemName: string) => {
      switch (itemName) {
        case Operations.UNDO_DELETE:
          expGraph.undoDeleteNode();
          break;
        case Operations.GROUP_SELECT:
          expGraph.toggleSelectionEnabled();
          setSelectionEnabled((enabled) => !enabled);
          break;
        case Operations.RUN_SELECTED:
          expGraph.runGraph();
          break;
        case Operations.NEW_GROUP: {
          const value$ = new BehaviorSubject("");
          const modal = showModal({
            title: "????????????",
            width: 450,
            okText: "??????",
            cancelText: "??????",
            children: (
              <div
                style={{ fontSize: 12, display: "flex", alignItems: "center" }}
              >
                <div style={{ width: 50, marginBottom: 8 }}>?????????</div>
                <RxInput
                  value={value$}
                  onChange={(e) => {
                    value$.next(e.target.value);
                  }}
                />
              </div>
            ),
            onOk: () => {
              modal.update({ okButtonProps: { loading: true } });
              addNodeGroup(value$.getValue())
                .then((res: any) => {
                  modal.close();
                  selectedNodes!.forEach((node: BaseNode) => {
                    const nodeData = node.getData<any>();
                    node.setData({ ...nodeData, groupId: res.data.group.id });
                  });
                  const nodeMetas: any[] = selectedNodes!.map(
                    (node: BaseNode) => node.getData<any>()
                  );
                  expGraph.addNode(
                    formatGroupInfoToNodeMeta(res.data.group, nodeMetas)
                  );
                  expGraph.unSelectNode();
                })
                .finally(() => {
                  modal.update({ okButtonProps: { loading: false } });
                });
            },
          });
          break;
        }
        case Operations.UNGROUP: {
          const descendantNodes = selectedGroup!.getDescendants();
          const childNodes = descendantNodes.filter((node) => node.isNode());
          childNodes.forEach((node) => {
            const nodeData = node.getData<any>();
            node.setData({ ...nodeData, groupId: 0 });
          });
          selectedGroup!.setChildren([]);
          expGraph.deleteNodes(selectedGroup!);
          expGraph.unSelectNode();
          break;
        }
        default:
      }
    },
    [expGraph, activeNodeInstance, selectedNodes, experimentId, selectedGroup]
  );

  const newGroupEnabled =
    !!selectedNodes &&
    !!selectedNodes.length &&
    selectedNodes.length > 1 &&
    selectedNodes.every((node: BaseNode) => {
      return node.isNode() && !node.getData<any>().groupId;
    });

  const unGroupEnabled = !selectedNodes?.length && !!selectedGroup;

  return (
    <div className={styles.canvasToolbar}>
      <Toolbar hoverEffect={true} onClick={onClickItem}>
        <Group>
          <Item
            name={Operations.UNDO_DELETE}
            tooltip="??????????????????"
            icon={<RollbackOutlined />}
          />
          <Item
            name={Operations.GROUP_SELECT}
            active={selectionEnabled}
            tooltip="????????????"
            icon={<GatewayOutlined />}
          />
        </Group>
        <Group>
          <Item
            name={Operations.NEW_GROUP}
            disabled={!newGroupEnabled}
            tooltip="????????????"
            icon={<GroupOutlined />}
          />
          <Item
            name={Operations.UNGROUP}
            disabled={!unGroupEnabled}
            tooltip="????????????"
            icon={<UngroupOutlined />}
          />
        </Group>
        <Group>
          <Item
            name={Operations.RUN_SELECTED}
            disabled={!activeNodeInstance}
            tooltip="??????????????????"
            icon={<PlaySquareOutlined />}
          />
        </Group>
      </Toolbar>
    </div>
  );
};
