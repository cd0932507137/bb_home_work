import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'antd';

import '../../App.css';

const CustomModal = props => {
    const { title, show, children, handleOk, onCancel, footer } = props;
    return (
        <Modal title={title} visible={show} onOk={handleOk} onCancel={onCancel} footer={footer} centered={true} maskClosable={false}>
            {children}
        </Modal>
    );
};

CustomModal.propTypes = {
    title: PropTypes.string,
    show: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    handleOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    footer: PropTypes.array,
};

export default CustomModal;
