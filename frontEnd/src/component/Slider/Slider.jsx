import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import * as R from 'ramda';

import { apiUserRouterConfigList } from '../../api';

import '../Slider/Slider.css';

/** component */
import { CustomNotification } from '../Notification/Notification';
import CustomHeader from '../Header/Header';
import CustomFooter from '../Footer/Footer';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

import { routeConfig } from '../../utils/routeConfig';

const { Sider, Content } = Layout;
const { SubMenu } = Menu;

const CustomSlider = () => {
    const [routerConfigData, setRouterConfigData] = useState([]);
    const permissionRoute = localStorage.getItem('user');
    const permissionState = JSON.parse(permissionRoute);

    const fn = R.pipe(R.map(R.indexBy(R.prop('router_id'))), R.reduce(R.mergeWith(R.merge), {}), R.values);
    const fnMerge = R.pipe(R.map(R.indexBy(R.prop('name'))), R.reduce(R.mergeWith(R.merge), {}), R.values);

    const fetchData = () => {
        apiUserRouterConfigList().then(res => {
            const { statusCode, data } = res.data;
            if (statusCode === 200) {
                // 第一次合併
                const mergeOne = fn([permissionState.permission, data]);
                // 第二次合併
                const resultData = fnMerge([mergeOne, routeConfig]);
                setRouterConfigData(resultData);
                const itemData = {
                    ...permissionState,
                    permission: resultData
                }
                console.log('itemData', itemData)
                localStorage.setItem('user', JSON.stringify(itemData));
            }
            if (statusCode !== 200) {
                setRouterConfigData([]);
                CustomNotification({
                    type: 'error',
                    title: 'failed',
                    text: 'failed',
                });
            }
        });
    };

    useEffect(() => {
        fetchData();
    }, []);
    return (
        <Layout className="layout">
            <Router>
                <Layout>
                    <Sider
                        breakpoint="lg"
                        collapsedWidth="0"
                        onBreakpoint={broken => {
                            console.log(broken);
                        }}
                        onCollapse={(collapsed, type) => {
                            console.log(collapsed, type);
                        }}
                        style={{
                            minHeight: '100vh',
                        }}
                    >
                        <div className="logo" />
                        <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
                            {routerConfigData.map((d, i) => {
                                if (d.path === '/content' && d.default_permission === 1) {
                                    return d.subMenu.map((sub, i) => (
                                        <SubMenu key={sub.path} icon={sub.icon} title={'我想留言'}>
                                            <Menu.Item key={sub.name}>
                                                <Link to={sub.path}>{sub.name}</Link>
                                            </Menu.Item>
                                        </SubMenu>
                                    ));
                                } else {
                                    if (d.default_permission === 1) {
                                        return (
                                            <Menu.Item key={d.name} icon={d.icon} disabled={d.disabled}>
                                                <Link to={d.path}>{d.name}</Link>
                                            </Menu.Item>
                                        );
                                    }
                                }
                            })}
                        </Menu>
                    </Sider>
                    <Layout>
                        <CustomHeader />
                        <ErrorBoundary>
                            <Content style={{ margin: '24px 16px 0' }}>
                                <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                                    <Switch>
                                        {routerConfigData.map(d => (
                                            <Route exact path={d.path} key={d.path}>
                                                {d.route}
                                            </Route>
                                        ))}
                                    </Switch>
                                </div>
                            </Content>
                        </ErrorBoundary>

                        <CustomFooter />
                    </Layout>
                </Layout>
            </Router>
        </Layout>
    );
};

export default CustomSlider;
