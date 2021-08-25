import { Layout } from "antd";
import * as React from "react";
import { GuideHeader } from "../layout/header";
import styles from "../style/index.module.less";
import classNames from "classnames";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ComponentTreePanel } from "../components/component-tree-panel";
import { ComponentConfigPanel } from "../components/component-config-panel";
import { DAGCanvas } from "../components/dag-canvas";
import { socket } from '../web-sockets'
import { useParams } from "react-router-dom";
export interface ITemplateComponentProps {
}

export default function TemplateComponent(props: ITemplateComponentProps) {
    const { experimentId } = useParams()
    const { Content } = Layout;
    socket.on('welcome', (data) => {
        console.log("Welcome event inside JoinRoom", data);
        // props.onJoinSuccess(data);
    });
    return (
        <Layout className={styles.layout}>
            <GuideHeader experimentId={experimentId} />
            <Content className={styles.content}>
                <div className={classNames(styles.experiment)}>
                    <DndProvider backend={HTML5Backend}>
                        <ComponentTreePanel
                            experimentId={experimentId}
                            className={styles.nodeSourceTree}
                        />
                        <div className={styles.editPanel}>
                            <DAGCanvas
                                experimentId={experimentId}
                                className={styles.dagCanvas}
                            />
                            <ComponentConfigPanel
                                experimentId={experimentId}
                                className={styles.confPanel}
                            />
                        </div>
                    </DndProvider>
                </div>
            </Content>
        </Layout>
    );
}
