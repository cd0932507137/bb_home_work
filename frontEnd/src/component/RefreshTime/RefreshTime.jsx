import React, { useState, useEffect } from 'react';
import { Select, Button } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import * as R from 'ramda';

import '../RefreshTime/RefreshTime.css';

const { Option } = Select;
const CustomRefreshTime = (props) => {
    const { setTimeValue } = props
    // 紀錄選取倒數時間state
    const [timeText, setTimeText]= useState(0)
    // 倒數時間state(倒數用)
    const [remain, setRemain]= useState(0)
    const handleChange = value => {
        setTimeValue(value)
        setTimeText(value)
        setRemain(value)
    };
    const [refreshTimeData, setRefreshTimeData] = useState([
        {
            name: 'off',
            value: 0,
        },
        {
            name: '5s',
            value: 5000,
        },
        {
            name: '15s',
            value: 15000,
        },
        {
            name: '30s',
            value: 30000,
        },
    ]);

    useEffect(() => {
        const countDownTimer = setInterval(() => {
            setRemain(remain - 1000 <= 0 ? timeText : remain - 1000)
        }, 1000)

        return () => {
            clearInterval(countDownTimer)
        }
    }, [remain]);
    return (
        <>
            {remain === 0 ? '' : <span style={{
                marginRight: '10px',
            }}>{remain / 1000}秒後自動倒數</span>}
            <Button style={{
                width: '31px',
                height: '31px',
            }} type="primary" icon={<SyncOutlined />} />
            <Select defaultValue="off" style={{ width: 120 }} onChange={handleChange}>
                {refreshTimeData.map((data, i) => (
                    <Option value={Number(data.value)} key={i}>
                        <span style={{
                            color: '#EB7818'
                        }}>{data.name}</span>
                    </Option>
                ))}
            </Select>
        </>
    );
};

export default CustomRefreshTime;
