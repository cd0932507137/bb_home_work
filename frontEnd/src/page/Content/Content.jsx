import React, { Fragment, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Row, Col, Form, Input, Button, Divider, Typography } from 'antd';
import moment from 'moment';

import '../../App.css';

/** api */
import { apiUserSendContent, apiUserMsg } from '../../api';

/** component */
import Comment from '../../component/Comment/Comment';
import { CustomNotification } from '../../component/Notification/Notification';
import CustomModal from '../../component/Modal/Modal';

/** i18n */
import { useTranslation } from 'react-i18next';

/** utils */
import { permissionValidation } from '../../utils/share';

const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
};

const { Title } = Typography;

const CustomContent = () => {
    const location = useLocation();
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [fetchData, setFetchData] = useState([]);
    // 權限驗證
    const [permissionValidationState, setPermissionValidationState] = useState({
        operational_permission: 0,
        default_permission: 0,
    });
    const { t, i18n } = useTranslation();
    // 驗證
    const validateMessages = {
        required: '${label}' + t('留言板.為必填欄位'),
    };
    const onFinish = values => {
        const creatTime = moment().format('YYYY-MM-DD HH:mm:ss');
        const params = {
            ...values.user,
            created_at: creatTime,
        };
        apiUserSendContent(params)
            .then(res => {
                const { statusCode, data } = res.data;
                if (statusCode === 200) {
                    // 清空表單
                    form.resetFields();
                    // 關閉對話框
                    setVisible(false);
                    // 添加成功訊息提示
                    CustomNotification({
                        type: 'success',
                        title: '留言成功',
                        text: 'Message successfully',
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
                console.log('err', err);
            });
    };

    const getData = () => {
        apiUserMsg()
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

    const showModal = () => {
        setVisible(true);
    };

    const handleOk = e => {
        setVisible(false);
    };
    const handleCancel = e => {
        setVisible(false);
    };
    return (
        <Fragment>
            <div className="site-layout-content">
                <div
                    style={{
                        textAlign: 'right',
                    }}
                >
                    <Button
                        type="primary"
                        onClick={showModal}
                        disabled={permissionValidationState.operational_permission}
                    >
                        {t('留言板.我要留言')}
                    </Button>
                </div>
                <Divider>{t('留言板.留言板')}</Divider>
                {fetchData.length === 0 ? (
                    <div
                        style={{
                            textAlign: 'center',
                        }}
                    >
                        <Title level={5} type="secondary">
                            {t('留言板.沒有留言')}
                        </Title>
                    </div>
                ) : (
                    /** 評論元件 */
                    <Comment dataContent={fetchData} />
                )}
            </div>
            <CustomModal
                title={t('留言板.我要留言')}
                show={visible}
                handleOk={handleOk}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    {...layout}
                    form={form}
                    name="nest-messages"
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                >
                    <Form.Item name={['user', 'name']} label={t('留言板.姓名')} rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name={['user', 'content']} label={t('留言板.內容')} rules={[{ required: true }]}>
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{ ...layout.wrapperCol }}
                        style={{
                            textAlign: 'right',
                        }}
                    >
                        <Button
                            onClick={e => {
                                e.preventDefault();
                                form.resetFields();
                            }}
                        >
                            {t('留言板.清除')}
                        </Button>
                        <Button
                            type="primary"
                            style={{
                                marginLeft: '10px',
                            }}
                            htmlType="submit"
                        >
                            {t('留言板.提交')}
                        </Button>
                    </Form.Item>
                </Form>
            </CustomModal>
        </Fragment>
    );
};

export default CustomContent;
