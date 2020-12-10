import { notification } from 'antd';

import '../../App.css';

export const CustomNotification = props => {
    const { type, title, text } = props;
    notification[type]({
        // 標題
        message: title,
        // 敘述
        description: text,
        // 持續時間
        duration: 3,
    });
};
