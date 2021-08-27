import React, { useState, useEffect } from "react";
import { Layout, Button } from "antd";
import { Wcontainer, Wbar } from '@alicloud/cloud-charts';
import { socket } from "../web-sockets";
import styles from "../style/index.module.less";
import { useParams } from "react-router-dom";
import _ from "lodash";
import * as api from "../api";
interface IViewComponentProps {
    experimentId: string;
}
export default function ViewComponent(props: IViewComponentProps) {

    const [data, setData] = useState([])
    const { experimentId } = useParams()

    const options = {
        padding: [50, 50, 50, 50],
    };
    useEffect(() => {
        getNodeIds();
        var loop = setInterval(() => {
            getNodeIds();
        }, 2000)

        return () => {
            clearInterval(loop);
        }
    }, [])

    const getNodeIds = async () => {
        const nodes = await api.getExperimentById(experimentId);
        if (nodes.data) {
            let _nodes = nodes.data.graph.nodes
            const ids = _nodes.map((node) => {
                return node.id
            });
            const keysNodesObj = _.keyBy(_nodes, "id");
            socket.emit(
                "queryJob",
                { experimentId: experimentId, nodeIds: ids },
                (err, res) => {
                    const list = _.map(res.data, (element) => {
                        if (keysNodesObj[element[0]]) {
                            return [keysNodesObj[element[0]].name, element[1]]
                        }
                    });
                    const data1 = [{
                        name: '值',
                        data: list
                    }];
                    setData(data1)
                }
            )
        }
    }
    const h = window.innerHeight - 300
    return (
        <div className={styles.layout}>
            <div style={{ padding: "100px 50px 50px" }}>
                <Wcontainer className="demos">
                    <Wbar height={h} config={options} data={data} />
                </Wcontainer>
                <p style={{ color: "red" }}>*数据每两秒更新一次</p>
            </div>
        </div>
    )
}