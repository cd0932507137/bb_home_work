import React from 'react';
import { Layout, Form, Input, Button, Select, Typography } from 'antd';
import { useHistory, Link } from 'react-router-dom';

import { i18nLang } from '../../utils/i18nLang';

import '../../App.css';

/** api */
import { apiUserLogin } from '../../api'

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

const CustomLogin = () => {
    const history = useHistory();
    const { t, i18n } = useTranslation();

    const handleChange = value => {
        i18n.changeLanguage(value);
    };
    const onFinish = values => {
        const params = {
            username: values.username,
            password: values.password,
        }
        apiUserLogin(params).then(res => {
            console.log('login', res)
            const { statusCode, data } = res.data;
            if (statusCode === 200) {
                localStorage.setItem('user', JSON.stringify(data));
                // 轉跳至首頁
                history.push('/');
            }
            if (statusCode !== 200) {
                CustomNotification({
                    type: 'error',
                    title: t('login.failed'),
                    text: 'Login failed',
                });
            } 
        }).catch(err => {
            console.log(err);
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
                    <Title level={2}>{t('login.login_page')}</Title>
                </div>
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label={t('login.username')}
                        name="username"
                        rules={[{ required: true, message: t('login.username_message') }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={t('login.password')}
                        name="password"
                        rules={[{ required: true, message: t('login.password_message') }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item name="language" label={t('login.language')} initialValue="繁體中文">
                        <Select onChange={handleChange}>
                            {i18nLang.map((i18n, i) => (
                                <Option value={i18n.key} key={i} disabled={i18n.disabled}>
                                    {i18n.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            {t('login.submit')}
                        </Button>
                        <Button
                            htmlType="button"
                            style={{
                                marginLeft: '10px',
                            }}
                        >
                            <Link to="/register">{t('login.register')}</Link>
                        </Button>
                    </Form.Item>
                </Form>
            </Content>
        </Layout>
    );
};

export default CustomLogin;
