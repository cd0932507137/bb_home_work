import React, { Fragment, useEffect, useState } from 'react';
import { Grid, Row, Col, Card, Input, Button, Table, Divider } from 'antd';
import Select, { components } from 'react-select';
import Tooltip from '@atlaskit/tooltip';
import { Field, Form, Formik, withFormik } from 'formik';

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    CartesianGrid,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip as ChartTooltip,
    Legend,
    PieChart,
    Pie,
    AreaChart,
    Area,
} from 'recharts';

import {
    fakeBarChartData,
    fakeLineChartData,
    fakePieChartData,
    fakeAreaChartData,
    fakeSearchTableData,
    optionArray,
} from './fakeData';

import '../../App.css';

/** i18n */
import { useTranslation } from 'react-i18next';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const { useBreakpoint } = Grid;

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const CustomHome = () => {
    const { t } = useTranslation();
    const columns = [
        {
            title: '員工編號',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: t('表格輸出.姓名'),
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '部門',
            dataIndex: 'department',
            key: 'department',
        },
    ];

    const formikEnhancer = withFormik({
        mapPropsToValues: props => ({
            department: [],
            tableData: fakeSearchTableData,
            loading: false,
        }),
        handleSubmit: (values, { setSubmitting, setFieldValue }) => {
            setFieldValue('loading', true)
            const payload = {
                ...values,
                department: values.department.map(t => t.value),
            };
            const { department, tableData } = values;
            const departmentValue = department.map(d => d.value);
            const filterData = tableData.filter(data => departmentValue.indexOf(data.department) >= 0)
            setFieldValue('tableData', filterData)
            setSubmitting(false)
            setFieldValue('loading', false)
        },
        displayName: 'MyForm',
    });

    const MyForm = props => {
        const { values, dirty, handleSubmit, handleReset, setFieldValue, isSubmitting } = props;

        return (
            <>
                <Form onSubmit={handleSubmit}>
                    <Row gutter={24}>
                        <Col span={10}>
                            <CustomSelect value={values.department} onChange={setFieldValue} />
                        </Col>
                        <Col span={4}>
                            <Button type="primary" htmlType="submit" disabled={isSubmitting}>
                                Search
                            </Button>
                            <Button
                                style={{ margin: '0 8px' }}
                                onClick={handleReset}
                                disabled={!dirty || isSubmitting}
                            >
                                Clear
                            </Button>
                        </Col>
                    </Row>
                    {/** table */}
                    <div
                        style={{
                            marginTop: '20px',
                        }}
                    />
                    <Table
                        rowClassName={(record, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
                        columns={columns}
                        dataSource={values.tableData}
                        pagination={false}
                        loading={values.loading}
                    />
                </Form>
            </>
        );
    };

    /**
     * CustomSelect
     * @desc 自定義下拉選單
     */
    const CustomSelect = props => {
        const { onChange, value } = props;
        // 屏幕斷點
        const screens = useBreakpoint();
        /**
         * ValueContainer
         * @desc 下拉選單判斷樣式
         */
        const ValueContainer = ({ children, ...props }) => {
            const { getValue } = props;
            const selectVal = getValue().map(val => val.label);
            const selectLength = getValue().length;
            const dropDown = Object.entries(screens)
                .filter(screen => !!screen[1])
                .map(s => s[0]);
            console.log('Breakpoint', dropDown);
            if (selectLength > 3) {
                return (
                    <>
                        <Tooltip content={selectVal.join(',')} truncateText position="top">
                            <components.ValueContainer
                                {...props}
                            >{`${selectLength} items selected`}</components.ValueContainer>
                        </Tooltip>
                    </>
                );
            }
            if (dropDown.length <= 3) {
                if (selectLength === 0) {
                    return <components.ValueContainer {...props}>{children}</components.ValueContainer>;
                }
                if (selectLength > 0) {
                    return (
                        <>
                            <Tooltip content={selectVal.join(',')} truncateText position="top">
                                <components.ValueContainer
                                    {...props}
                                >{`${selectLength} items selected`}</components.ValueContainer>
                            </Tooltip>
                        </>
                    );
                }
            }
            return <components.ValueContainer {...props}>{children}</components.ValueContainer>;
        };
        const handleChange = value => {
            onChange('department', value);
        };

        return (
            <div>
                <Select
                    isMulti
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    options={optionArray}
                    placeholder={'請選擇部門'}
                    components={{ ValueContainer }}
                    onChange={handleChange}
                    value={value}
                />
            </div>
        );
    };

    const AdvancedSearchForm = formikEnhancer(MyForm);

    return (
        <Fragment>
            <div className="site-layout-content">
                <Divider>Search Layout</Divider>
                <AdvancedSearchForm />
                <Divider>Chart Layout</Divider>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Card title={t('home.bar_chart')}>
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <BarChart
                                        width={500}
                                        height={300}
                                        data={fakeBarChartData}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <ChartTooltip />
                                        <Legend />
                                        <Bar dataKey="pv" fill="#8884d8" />
                                        <Bar dataKey="uv" fill="#82ca9d" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title={t('home.line_chart')}>
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <LineChart
                                        width={500}
                                        height={300}
                                        data={fakeLineChartData}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <ChartTooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                                        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title={t('home.pie_chart')}>
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={fakePieChartData}
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {fakePieChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title={t('home.area_chart')}>
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <AreaChart
                                        data={fakeAreaChartData}
                                        margin={{
                                            top: 10,
                                            right: 30,
                                            left: 0,
                                            bottom: 0,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <ChartTooltip />
                                        <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </Fragment>
    );
};

export default CustomHome;
