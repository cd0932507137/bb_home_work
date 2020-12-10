import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Table, Input, Select, Popconfirm, Form, Space, Button, Tooltip, Row, Col } from 'antd';

import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import '../../App.css';

/** api */
import { apiUserMember, apiUserEditMember, apiUserDeleteMember, apiUserPermissionSetting } from '../../api';

/** component */
import { CustomNotification } from '../../component/Notification/Notification';
import CustomDrawer from '../../component/Drawer/Drawer';

/** i18n */
import { useTranslation } from 'react-i18next';

/** utils */
import { permissionValidation } from '../../utils/share';

const { Option } = Select;

const CustomMemberList = () => {
    const location = useLocation();
    const { t, i18n } = useTranslation();
    const [form] = Form.useForm();
    const [memberData, setMemberData] = useState([]);
    const [permissionGroupList, setPermissionGroupList] = useState([]);
    const [visible, setVisible] = useState(false);
    const [state, setState] = useState({
        filteredInfo: null,
        sortedInfo: null,
    });
    let { sortedInfo, filteredInfo } = state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const columns = [
        {
            title: t('member_list.columns.name'),
            dataIndex: 'username',
            responsive: ['lg'],
            filters: [
                { text: 'root', value: 'root' },
                { text: 'test', value: 'test' },
            ],
            filteredValue: filteredInfo.username || null,
            onFilter: (value, record) => record.username.includes(value),
            sorter: (a, b) => a.username.length - b.username.length,
            sortOrder: sortedInfo.columnKey === 'username' && sortedInfo.order,
            ellipsis: true,
        },
        {
            title: t('member_list.columns.email'),
            dataIndex: 'email',
            responsive: ['lg'],
        },
        {
            title: t('member_list.authority'),
            dataIndex: 'name',
            responsive: ['lg']
        },
        {
            title: t('member_list.columns.operation'),
            dataIndex: 'operation',
            render: (text, record) => (
                <Space size="middle">
                    <Tooltip title={t('member_list.edit')}>
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setVisible(true);
                                form.setFieldsValue({
                                    id: record.id,
                                    key: record.key,
                                    username: record.username,
                                    email: record.email,
                                    authority: record.authority,
                                });
                            }}
                            disabled={permissionValidationState.operational_permission}
                        />
                    </Tooltip>
                    {permissionValidationState.operational_permission ? (
                        <Tooltip title={t('member_list.delete')}>
                            <Button
                                type="danger"
                                shape="circle"
                                icon={<DeleteOutlined />}
                                disabled={permissionValidationState.operational_permission}
                            />
                        </Tooltip>
                    ) : (
                        <Popconfirm
                            title={t('member_list.You_sure_you_want_to_delete_it')}
                            onConfirm={e => confirm(e, record)}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Tooltip title={t('member_list.delete')}>
                                <Button
                                    type="danger"
                                    shape="circle"
                                    icon={<DeleteOutlined />}
                                    disabled={permissionValidationState.operational_permission}
                                />
                            </Tooltip>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];
    // 權限驗證
    const [permissionValidationState, setPermissionValidationState] = useState({
        operational_permission: 0,
        default_permission: 0,
    });

    const handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    };

    const save = async key => {
        try {
            const row = await form.validateFields();
            const newData = [...memberData];
            const index = newData.findIndex(item => key === item.key);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                // 更新資料
                const updateData = newData[index];

                const params = {
                    id: updateData.id,
                    username: updateData.username,
                    email: updateData.email,
                    authority: updateData.authority,
                };
                console.log('params', params);
                apiUserEditMember(params)
                    .then(res => {
                        const { statusCode, data } = res.data;
                        if (statusCode === 200) {
                            fetchDataMethod();
                            CustomNotification({
                                type: 'success',
                                title: t('member_list.Successfully_modified'),
                                text: 'Successfully modified',
                            });
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
                        console.log(err);
                    });
                setMemberData(newData);
            } else {
                newData.push(row);
                console.log('row', row);
                setMemberData(newData);
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    // 確定刪除
    const confirm = (e, record) => {
        console.log(e);
        const params = {
            id: record.key,
        };
        // 刪除邏輯
        apiUserDeleteMember(params)
            .then(res => {
                const { statusCode, data } = res.data;
                if (statusCode === 200 && data !== null) {
                    fetchDataMethod();
                    setMemberData(memberData.filter(data => data.id !== record.key));
                    CustomNotification({
                        type: 'success',
                        title: t('member_list.Successfully_deleted'),
                        text: 'Successfully delete',
                    });
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
                console.log(err);
            });
    };

    // 取消刪除
    const cancel = e => {
        console.log(e);
    };

    const handleCancel = e => {
        form.resetFields();
        setVisible(false);
    };

    const fetchDataMethod = () => {
        apiUserMember()
            .then(res => {
                const { statusCode, data } = res.data;
                if (statusCode === 200 && data !== null) {
                    const memberArray = data.map(d => ({
                        ...d,
                        key: d.id,
                    }));
                    // setState
                    setMemberData(memberArray);
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
                console.log('錯誤:', err);
            });
    };

    /**
     * getPermissionGroupListData
     * @desc 取得權限群組資料
     */
    const getPermissionGroupListData = () => {
        apiUserPermissionSetting()
            .then(res => {
                const { statusCode, data } = res.data;
                if (statusCode === 200) {
                    setPermissionGroupList(data);
                }
                if (statusCode !== 200) {
                    setPermissionGroupList([]);
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

    useEffect(() => {
        // fetch data
        fetchDataMethod();
        // 取得權限群組資料
        getPermissionGroupListData();
        // 取得權限狀態
        permissionValidation({
            path: location.pathname,
            setPermissionValidationState: setPermissionValidationState,
        });
    }, []);
    return (
        <>
            <Table columns={columns} dataSource={memberData} pagination={false} onChange={handleChange} />
            <CustomDrawer
                title={t('member_list.member_Name') + ':' + form.getFieldValue('username')}
                show={visible}
                onCancel={handleCancel}
                footer={
                    <div
                        style={{
                            textAlign: 'right',
                        }}
                    >
                        <Button
                            onClick={() => {
                                setVisible(false);
                                form.resetFields();
                            }}
                            style={{ marginRight: 8 }}
                        >
                            {t('member_list.cancel')}
                        </Button>
                        <Button
                            onClick={() => {
                                setVisible(false);
                                const keyData = form.getFieldValue('key');
                                save(keyData);
                            }}
                            type="primary"
                        >
                            {t('member_list.save')}
                        </Button>
                    </div>
                }
            >
                <Form form={form} layout="vertical" hideRequiredMark>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="username"
                                label={t('member_list.columns.name')}
                                rules={[{ required: true, message: t('member_list.Please_enter_user_name') }]}
                            >
                                <Input placeholder={t('member_list.Please_enter_user_name')} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="email"
                                label={t('member_list.columns.email')}
                                rules={[{ required: true, message: t('member_list.Please_enter_user_email') }]}
                            >
                                <Input placeholder={t('member_list.Please_enter_user_email')} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="authority"
                                label={t('member_list.authority')}
                                rules={[{ required: true, message: t('member_list.Please_select_an_authority') }]}
                            >
                                <Select placeholder={t('member_list.Please_select_an_authority')}>
                                    {permissionGroupList.map((list, i) => (
                                        <Option key={i} value={list.permission_id}>
                                            {list.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </CustomDrawer>
        </>
    );
};

export default CustomMemberList;
