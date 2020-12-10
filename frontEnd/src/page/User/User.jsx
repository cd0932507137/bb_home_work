import React, { Fragment } from 'react';
import { Row, Col, Image, Descriptions } from 'antd';

/** i18n */
import { useTranslation } from 'react-i18next';

import '../../App.css';

const CustomUser = () => {
    const { t, i18n } = useTranslation();

    const userData = localStorage.getItem('user')
    const userState = JSON.parse(userData)
    return (
        <Fragment>
            <Row>
                <Col span={6}>
                    <Image
                        width={200}
                        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                    />
                </Col>
                <Col span={18}>
                    <Descriptions title={t('user.user_information')}>
                        <Descriptions.Item label={t('user.user_name')}><span style={{
                            color: 'red',
                        }}>{userState.username}</span></Descriptions.Item>
                        <Descriptions.Item label={t('user.phone')}>{t('user.data.phone')}</Descriptions.Item>
                        <Descriptions.Item label={t('user.place_of_residence')}>
                            {t('user.data.place_of_residence')}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('user.email')}><span style={{
                            color: 'red',
                        }}>{userState.email}</span></Descriptions.Item>
                        <Descriptions.Item label={t('user.address')}>{t('user.data.address')}</Descriptions.Item>
                    </Descriptions>
                </Col>
            </Row>
        </Fragment>
    );
};

export default CustomUser;
