import { Layout } from 'antd';
import * as React from 'react';
import { GuideHeader } from '../layout/header';
import styles from '../style/index.module.less';
import classNames from 'classnames';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ComponentTreePanel } from '../components/component-tree-panel';
import { ComponentConfigPanel } from '../components/component-config-panel';
import { DAGCanvas } from '../components/dag-canvas';

export interface IAppProps {
    experimentId?
}

export default function App(props: IAppProps) {
    const { experimentId = '1' } = props;
    const { Content } = Layout;

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
