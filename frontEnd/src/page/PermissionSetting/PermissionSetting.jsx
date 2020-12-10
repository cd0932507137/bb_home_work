import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Table, Space, Button, Switch } from 'antd';

import * as _ from 'lodash';

import '../../App.css';

/** api */
import {
    apiUserPermissionSetting,
    apiUserPermissionList,
    apiUserRouterConfigList,
    apiUserEditPermission,
} from '../../api';

/** component */
import { CustomNotification } from '../../component/Notification/Notification';
import CustomModal from '../../component/Modal/Modal';

/** i18n */
import { useTranslation } from 'react-i18next';

/** utils */
import { permissionValidation } from '../../utils/share';

const CustomPermissionSetting = () => {
    const location = useLocation();
    const { t, i18n } = useTranslation();
    const [visible, setVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [fetchData, setFetchData] = useState([]);
    const [permissionData, setPermissionData] = useState({
        id: 1,
        permissionId: 1,
        name: '',
        data: [],
    });
    const [routerConfigData, setRouterConfigData] = useState([]);
    const [changeData, setChangeData] = useState({
        data: [],
    });
    // 權限驗證
    const [permissionValidationState, setPermissionValidationState] = useState({
        operational_permission: 0,
        default_permission: 0,
    });

    const [columns, setColumns] = useState([]);

    const modalColumns = [
        {
            title: '',
            dataIndex: 'router_id',
            key: 'router_id',
            render: (text, record) => {
                const routerName = routerConfigData.filter(router => router.router_id === record.router_id)[0].name;
                return <p>{routerName}</p>;
            },
        },
        {
            title: t('權限設定.查看'),
            dataIndex: 'default_permission',
            key: 'default_permission',
            shouldCellUpdate: (record, prevRecord) => {
                return record
            },
            render: (node, record) => {
                if (record.router_id === 1) {
                    return (
                        <Switch
                            key={node}
                            checkedChildren={t('權限設定.開啟')}
                            unCheckedChildren={t('權限設定.關閉')}
                            defaultChecked={true}
                            disabled={true}
                        />
                    );
                } else {
                    return (
                        <Switch
                            key={node}
                            checkedChildren={t('權限設定.開啟')}
                            unCheckedChildren={t('權限設定.關閉')}
                            defaultChecked={node}
                            onChange={value => onChangeDefault({ data: record, value: value })}
                        />
                    );
                }
              }
        },
        {
            title: t('權限設定.查看編輯'),
            dataIndex: 'operational_permission',
            key: 'operational_permission',
            render: (text, record) => {
                if (record.router_id === 1) {
                    return (
                        <Switch
                            key={record.router_id}
                            checkedChildren={t('權限設定.開啟')}
                            unCheckedChildren={t('權限設定.關閉')}
                            defaultChecked={true}
                            disabled={true}
                        />
                    );
                } else {
                    return (
                        <Switch
                            key={record.router_id}
                            checkedChildren={t('權限設定.開啟')}
                            unCheckedChildren={t('權限設定.關閉')}
                            defaultChecked={record.operational_permission}
                            onChange={value => onChangeOperational({ data: record, value: value })}
                        />
                    );
                }
            },
        },
    ];

    const showModal = text => {
        console.log(text);
        setModalTitle(text.name);
        setVisible(true);
        apiUserPermissionList({
            permission_id: text.permission_id,
        })
            .then(res => {
                const { statusCode, data } = res.data;
                if (statusCode === 200) {
                    setPermissionData(data);
                    setPermissionData(prevState => ({
                        ...prevState,
                        id: text.id,
                        permissionId: text.permission_id,
                        name: text.name,
                        data: _.sortBy(data, 'router_id'),
                    }));
                }
                if (statusCode !== 200) {
                    CustomNotification({
                        type: 'error',
                        title: 'failed',
                        text: 'failed',
                    });
                }
            })
            .catch(err => {
                console.log('err', err);
            });
    };

    const handleOk = e => {
        setVisible(false);
    };
    const handleCancel = e => {
        setVisible(false);
        setPermissionData(prevState => ({
            ...prevState,
            id: 1,
            permissionId: 1,
            name: '',
            data: [],
        }));
    };

    const getData = () => {
        apiUserPermissionSetting()
            .then(res => {
                const { statusCode, data } = res.data;
                if (statusCode === 200) {
                    setFetchData(data);
                }
                if (statusCode !== 200) {
                    setFetchData([]);
                    CustomNotification({
                        type: 'error',
                        title: 'failed',
                        text: 'failed',
                    });
                }
            })
            .catch(err => {
                console.log('err', err);
            });
        apiUserRouterConfigList().then(res => {
            const { statusCode, data } = res.data;
            if (statusCode === 200) {
                setRouterConfigData(data);
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
        // get data
        getData();
        // 取得權限狀態
        permissionValidation({
            path: location.pathname,
            setPermissionValidationState: setPermissionValidationState,
        });
    }, []);

    useEffect(() => {
        // 渲染列表
        setColumns([
            {
                title: t('權限設定.編號'),
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: t('權限設定.名稱'),
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: t('權限設定.操作'),
                key: 'action',
                render: (text, record) => (
                    <Space size="middle">
                        <Button
                            type="primary"
                            onClick={() => showModal(text)}
                            disabled={permissionValidationState.operational_permission}
                        >
                            {t('權限設定.編輯')}
                        </Button>
                    </Space>
                ),
            },
        ]);
    }, [permissionValidationState]);

    const getState = () => {
        console.log('setPermissionData', permissionData.data);
        const params = {
            data: permissionData.data,
        };
        apiUserEditPermission(params).then(res => {
            const { statusCode, data } = res.data;
            if (statusCode === 200) {
                setVisible(false);
                CustomNotification({
                    type: 'success',
                    title: 'Success',
                    text: 'Success',
                });
                setPermissionData(prevState => ({
                    ...prevState,
                    id: 1,
                    permissionId: 1,
                    name: '',
                    data: [],
                }));
            }
            if (statusCode !== 200) {
                CustomNotification({
                    type: 'error',
                    title: 'failed',
                    text: 'failed',
                });
            }
        });
    };

    const onChangeDefault = props => {
        const { data, value } = props;
        const permissionState = permissionData.data.filter(permission => permission.id !== data.id);
        const changeState = {
            ...data,
            default_permission: Number(value),
        };
        setPermissionData(prevState => ({
            ...prevState,
            data: [...permissionState, changeState].sort((a, b) => a.id - b.id),
        }));
    };

    const onChangeOperational = props => {
        const { data, value } = props;
        const permissionState = permissionData.data.filter(permission => permission.id !== data.id);
        const changeState = {
            ...data,
            operational_permission: Number(value),
            default_permission: Number(value) === 1 ? 1 : data.default_permission,
        };
        setPermissionData(prevState => ({
            ...prevState,
            data: [...permissionState, changeState].sort((a, b) => a.id - b.id),
        }));
    };

    return (
        <div>
            <Table columns={columns} dataSource={fetchData} pagination={false} />
            <CustomModal title={modalTitle} show={visible} handleOk={handleOk} onCancel={handleCancel} footer={null}>
                <Table columns={modalColumns} dataSource={permissionData.data} pagination={false} />
                <div
                    style={{
                        paddingTop: '20px',
                        textAlign: 'right',
                    }}
                >
                    <Button
                        onClick={e => {
                            e.preventDefault();
                            setVisible(false);
                            setPermissionData(prevState => ({
                                ...prevState,
                                id: 1,
                                permissionId: 1,
                                name: '',
                                data: [],
                            }));
                        }}
                    >
                        {t('權限設定.取消')}
                    </Button>
                    <Button
                        type="primary"
                        style={{
                            marginLeft: '10px',
                        }}
                        onClick={e => {
                            e.preventDefault();
                            getState();
                        }}
                    >
                        {t('權限設定.送出')}
                    </Button>
                </div>
            </CustomModal>
        </div>
    );
};

export default CustomPermissionSetting;
