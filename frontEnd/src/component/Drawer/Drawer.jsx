import React from 'react';
import PropTypes from 'prop-types';
import { Drawer } from 'antd';

const CustomDrawer = props => {
    const { title, show, children, handleOk, onCancel, footer } = props;

    return (
        <Drawer
            title={title}
            width={720}
            onClose={onCancel}
            visible={show}
            bodyStyle={{ paddingBottom: 80 }}
            footer={footer}
            maskClosable={false}
        >
            {children}
        </Drawer>
    );
};

CustomDrawer.propTypes = {
    title: PropTypes.string,
    show: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    onCancel: PropTypes.func.isRequired,
    footer: PropTypes.array,
};

export default CustomDrawer;
