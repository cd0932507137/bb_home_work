import React from 'react';
import PropTypes from 'prop-types';
import { Comment, Tooltip } from 'antd';
import moment from 'moment';

const CustomComment = props => {
    const { dataContent } = props;

    return dataContent.map((content, i) => (
        <Comment
            key={i}
            author={<div key={i}>{content.name}</div>}
            content={<p>{content.content}</p>}
            datetime={
                <Tooltip title={moment(content.created_at).format('YYYY-MM-DD HH:mm:ss')}>
                    <span>{moment(content.created_at).fromNow()}</span>
                </Tooltip>
            }
        />
    ));
};

CustomComment.propTypes = {
    dataContent: PropTypes.array.isRequired,
};

export default CustomComment;
