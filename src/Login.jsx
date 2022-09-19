import {Button, Card, Col, Form, Input, Layout, Row} from "antd";
import React, {useState} from "react";
import {EyeInvisibleOutlined, EyeTwoTone} from '@ant-design/icons';

function Login(){
    return <div>
        <Row type="flex" justify="center" align="middle" style={{minHeight:"100vh"}}>
            <Col span={4}>
                <Card>
                    <Form labelCol={{span:5}} wrapperCol={{span:16}}>
                        <Form.Item wrapperCol={{offset:5,span:20}}>
                            <h3>登录到 Mesence</h3>
                        </Form.Item>
                        <Form.Item label="手机号">
                            <Input placeholder="" />
                        </Form.Item>
                        <Form.Item label="密码">
                            <Input.Password
                                placeholder=""
                                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </Form.Item>
                        <Form.Item wrapperCol={{offset: 5,span: 20}}>
                            <Button type="primary" size={"large"}>
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    </div>
}

export default Login;