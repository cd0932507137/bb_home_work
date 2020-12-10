import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Table, Button, Row, Col } from 'antd';
import { CSVLink } from 'react-csv';
import moment from 'moment';

import '../../App.css';

/** component */
import CustomRefreshTime from '../../component/RefreshTime/RefreshTime';

/** i18n */
import { useTranslation } from 'react-i18next';

/** utils */
import { permissionValidation } from '../../utils/share';
import * as _ from 'lodash';

const CustomCsvDownload = () => {
    const location = useLocation();
    const { t, i18n } = useTranslation();
    const [fakeData, setFakeData] = useState({
        data: [],
        loading: true,
    });
    const [timeValue, setTimeValue] = useState(null);
    const downloadTime = moment().format('YYYY-MM-DD');
    // 權限驗證
    const [permissionValidationState, setPermissionValidationState] = useState({
        operational_permission: 0,
        default_permission: 0,
    });

    const columns = [
        {
            title: t('表格輸出.姓名'),
            dataIndex: 'name',
            key: 'name',
            render: text => <a>{text}</a>,
        },
        {
            title: t('表格輸出.電子郵件'),
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: t('表格輸出.內容'),
            dataIndex: 'body',
            key: 'body',
        },
    ];

    /**
     * fetchData
     */
    const fetchData = () => {
        fetch('https://jsonplaceholder.typicode.com/comments')
            .then(response => response.json())
            .then(json =>
                setFakeData({
                    data: json,
                    loading: false,
                }),
            );
    };

    useEffect(() => {
        // fetch data
        fetchData();
        // 取得權限狀態
        permissionValidation({
            path: location.pathname,
            setPermissionValidationState: setPermissionValidationState,
        });
    }, []);

    useEffect(() => {
        if (timeValue === 0) {
            return
        }
        if (timeValue > 0) {
            const timer = setInterval(() => {
                setFakeData(prevState => ({
                    ...prevState,
                    loading: true,
                }))
                fetchData();
            }, timeValue);
            return () => clearInterval(timer)
        }
    }, [timeValue]);

    return (
        <>
            <Row>
                <Col span={12}>
                    <CSVLink data={fakeData.data} filename={downloadTime + '.csv'}>
                        <Button type="primary" disabled={permissionValidationState.operational_permission || fakeData.loading}>
                            {t('表格輸出.匯出')}
                        </Button>
                    </CSVLink>
                </Col>
                <Col span={12}>
                    <div
                        style={{
                            textAlign: 'right',
                        }}
                    >
                        <CustomRefreshTime setTimeValue={setTimeValue} />
                    </div>
                </Col>
            </Row>
            <div
                style={{
                    marginTop: '20px',
                }}
            >
                <Table columns={columns} dataSource={fakeData.data} loading={fakeData.loading} />
            </div>
        </>
    );
};

export default CustomCsvDownload;
