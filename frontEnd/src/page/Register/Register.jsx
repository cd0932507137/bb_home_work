import React from 'react';
import { Layout, Form, Input, Button, Select, Typography } from 'antd';
import { useHistory, Link } from 'react-router-dom';
import moment from 'moment';

import '../../App.css';

/** api */
import { apiUserRegister } from '../../api'

/** component */
import { CustomNotification } from '../../component/Notification/Notification';

/** i18n */
import { useTranslation } from 'react-i18next';

const { Title } = Typography;
const { Content } = Layout;
const { Option } = Select;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 9 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

const CustomRegister = () => {
    const history = useHistory();
    const { t, i18n } = useTranslation();

    const onFinish = values => {
        console.log(values);
        const creatTime = moment().format('YYYY-MM-DD HH:mm:ss');
        const params = {
            ...values,
            created_at: creatTime,
        };
        console.log('params', params)
        apiUserRegister(params).then(res => {
            const { statusCode, data } = res.data;
            if (statusCode === 200) {
                history.push('/login');
            }
            if (statusCode !== 200) {
                CustomNotification({
                    type: 'error',
                    title: 'failed',
                    text: 'failed',
                });
            }
        }).catch(err => {
            console.log(err)
        })
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Layout>
            <div
                style={{
                    paddingTop: '100px',
                }}
            />
            <Content
                style={{
                    minHeight: '100vh',
                }}
            >
                <div style={{
                    textAlign: 'center',
                }}>
                    <Title level={2}>{t('login.register_page')}</Title>
                </div>
                <Form {...layout} name="basic" onFinish={onFinish} onFinishFailed={onFinishFailed}>
                    <Form.Item
                        label={t('Register.帳號')}
                        name="username"
                        rules={[{ required: true, message: t('Register.帳號為必填欄位') }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label={t('Register.電子郵件')}
                        name="email"
                        rules={[
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!',
                              },
                            { required: true, message: t('Register.電子郵件為必填欄位') }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label={t('Register.密碼')}
                        name="password"
                        rules={[{ required: true, message: t('Register.密碼為必填欄位') }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            {t('Register.儲存')}
                        </Button>
                        <Button
                            htmlType="button"
                            style={{
                                marginLeft: '10px',
                            }}
                        >
                            <Link to="/login">{t('Register.取消')}</Link>
                        </Button>
                    </Form.Item>
                </Form>
            </Content>
        </Layout>
    );
};

export default CustomRegister;
