import React from 'react';
import { Layout, Button, Tooltip, Select, Row, Col } from 'antd';
import { useHistory } from 'react-router-dom';

import { LogoutOutlined } from '@ant-design/icons';

import { i18nLang } from '../../utils/i18nLang';

/** i18n */
import { useTranslation } from 'react-i18next';

const { Header } = Layout;
const { Option } = Select;

const CustomHeader = () => {
    const history = useHistory();
    const { t, i18n } = useTranslation();

    const handleChange = value => {
        i18n.changeLanguage(value);
    };
    const logout = () => {
        localStorage.removeItem('user');
        history.push('/login');
        window.location.reload();
    };
    return (
        <Header
            className="site-layout-sub-header-background"
            style={{
                textAlign: 'right',
            }}
        >
            <Row justify="end">
                <Col span={2}>
                    <Select
                        defaultValue={i18n.languages[0] === 'zh-Tw' ? i18nLang[0].name : i18nLang[1].name}
                        onChange={handleChange}
                    >
                        {i18nLang.map((i18n, i) => (
                            <Option value={i18n.key} key={i} disabled={i18n.disabled}>
                                {i18n.name}
                            </Option>
                        ))}
                    </Select>
                </Col>
                <Col span={2}>
                    <Tooltip title="logout">
                        <Button onClick={logout} shape="circle" icon={<LogoutOutlined />} />
                    </Tooltip>
                </Col>
            </Row>
        </Header>
    );
};

export default CustomHeader;
