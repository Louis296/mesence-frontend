import "./css/message.css"
import {
    DesktopOutlined,
    FileOutlined, MenuFoldOutlined, MenuUnfoldOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {Breadcrumb, Button, Input, Layout, Menu, Space, Typography} from 'antd';
import React, { useState } from 'react';
const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const items = [
    getItem('Friends', 'sub1', <UserOutlined />, [
        getItem('Tom', '3'),
        getItem('Bill', '4'),
        getItem('Alex', '5'),
    ]),
];

function Message(){
    const [collapsed, setCollapsed] = useState(false);
    return <div>
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="logo">Mesence</div>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
            </Sider>
            <Layout className="site-layout">
                <Header
                    className="site-layout-background"
                    style={{
                        padding: 0,
                    }}>
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: () => setCollapsed(!collapsed),
                    })}
                </Header>
                <Content
                    style={{
                        margin: '0 16px',
                    }}
                >
                    <div style={{margin: '16px 0',}}/>
                    <div
                        className="site-layout-background"
                        style={{
                            padding: 24,
                            minHeight: 700,
                        }}
                    >
                        Message in here
                    </div>
                    <div style={{margin: '12px 0'}}/>
                    <Input.Group compact>
                        <Input style={{ width: 'calc(100% - 100px)' }}
                               placeholder="请输入信息" />
                        <Button type="primary">发送</Button>
                    </Input.Group>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                </Footer>
            </Layout>
        </Layout>
    </div>
}

export default Message