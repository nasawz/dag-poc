import { Layout } from "antd";
import React, { useEffect, useState, useRef, useMemo } from "react";
import styles from "../style/index.module.less";
import classNames from "classnames";
import { useParams } from "react-router-dom";
import { useTreeNodes } from "../hooks/useTreeNodes";
import { createForm, onFormSubmit } from '@formily/core'
import { createSchemaField } from '@formily/react'
import { Slider, Card, Spin, message } from 'antd'
import * as api from '../api'
import { socket } from "../web-sockets";

import {
    Form,
    FormItem,
    FormLayout,
    Input,
    Select,
    Radio,
    Password,
    NumberPicker,
    FormButtonGroup,
    Submit
} from '@formily/antd'
import { action } from '@formily/reactive'

const test = {
    "form": {
        "labelCol": 6,
        "wrapperCol": 12
    },
    "schema": {
        "type": "object",
        "properties": {
            "kd9vdg9bi63": {
                "type": "number",
                "title": "Slider1",
                "x-decorator": "FormItem",
                "x-component": "Slider",
                "x-validator": [],
                "x-component-props": {},
                "x-decorator-props": {},
                "_designableId": "kd9vdg9bi63",
                "x-index": 0
            },
            "upxx2hvx9su": {
                "type": "number",
                "title": "Slider2",
                "x-decorator": "FormItem",
                "x-component": "Slider",
                "x-validator": [],
                "x-component-props": {},
                "x-decorator-props": {},
                "_designableId": "upxx2hvx9su",
                "x-index": 1
            },
            "q151od22m47": {
                "type": "number",
                "title": "NumberPicker1",
                "x-decorator": "FormItem",
                "x-component": "NumberPicker",
                "x-validator": [],
                "x-component-props": {},
                "x-decorator-props": {},
                "_designableId": "q151od22m47",
                "x-index": 2
            },
            "7gmclejxmka": {
                "type": "number",
                "title": "Slider3",
                "x-decorator": "FormItem",
                "x-component": "Slider",
                "x-validator": [],
                "x-component-props": {},
                "x-decorator-props": {},
                "_designableId": "7gmclejxmka",
                "x-index": 3
            },
            "tvawrs0qfl9": {
                "type": "number",
                "title": "Slider4",
                "x-decorator": "FormItem",
                "x-component": "Slider",
                "x-validator": [],
                "x-component-props": {},
                "x-decorator-props": {},
                "_designableId": "tvawrs0qfl9",
                "x-index": 4
            }
        },
        "_designableId": "32p8sa0h3zw"
    }
}

export interface ITemplateComponentProps {
}

const initSchame = {
    "type": "object",
    "properties": {},
    "_designableId": Math.random().toString(36).substr(2)
}
export default function TemplateComponent(props: ITemplateComponentProps) {
    const { experimentId } = useParams()
    const [categoriesJson, setCategoriesJson] = useState(initSchame)
    const [canRender, setCanRender] = useState(false)
    const [loading, setLoading] = useState(true);
    const { Content } = Layout;

    useEffect(() => {
        getJSON()
    }, [])
    const getJSON = async () => {
        let res = await api.getExperimentById(experimentId);
        if (res) {
            res.data.graph.nodes.map((i, index) => {
                if (i.codeName == 'constant') {
                    console.log(i)
                    initSchame.properties[i.id] = {
                        "type": "number",
                        "title": i.name,
                        "x-decorator": "FormItem",
                        "x-component": "NumberPicker",
                        "x-validator": [],
                        "x-component-props": {
                            "precision": 2,
                            "step": 1
                        },
                        "x-decorator-props": {},
                        "_designableId": Math.random().toString(36).substr(2),
                        "default": i.data.constant ? i.data.constant : 0,
                        "x-index": index
                    }
                }
            })
            setCategoriesJson(initSchame)
            setCanRender(true)
            setLoading(false)
        }
    }
    const form =
        useMemo(
            () =>
                createForm({
                    validateFirst: true,
                    effects() {
                        onFormSubmit((v) => {
                            /* ================ 自定义接口提交代码 ===========*/
                            v.validate().then(
                                async () => {
                                    // console.log('in then')

                                    console.log(v.values)
                                    socket.emit(
                                        "updateNode",
                                        {
                                            data: { ...v.values },
                                        },
                                        (err, res) => {
                                            if (err) { message.error('提交失败, 请重试') }
                                            console.log(err, res.data);
                                        }
                                    );
                                }
                            )
                            /* ================ 自定义接口提交代码 ===========*/
                        })
                    },
                }),
            []
        )

    const SchemaField = createSchemaField({
        components: {
            FormItem,
            FormLayout,
            Input,
            Select,
            Radio,
            Password,
            NumberPicker,
            Slider,
            FormButtonGroup,
            Submit
        },
        scope: {},
    })

    return (
        <Layout className={styles.layout}>
            {/* <Content className={styles.content}> */}
            {/* <div>{JSON.stringify(categoriesJson)}</div> */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    background: '#fff',
                    width: '100%',
                    height: '100%'
                }}
            >
                <Card title="数据模拟器" style={{ width: 620 }}>
                    <Spin spinning={loading}>
                        {canRender && <Form
                            form={form}
                            labelCol={5}
                            wrapperCol={16}
                            onAutoSubmit={console.log}
                        >
                            <SchemaField schema={categoriesJson} scope={{}} />
                            <FormButtonGroup.FormItem>
                                <Submit block size="large">
                                    提交
                                </Submit>
                            </FormButtonGroup.FormItem>
                        </Form>}
                    </Spin>
                </Card>
            </div>
            {/* </Content> */}
        </Layout>
    );
}
