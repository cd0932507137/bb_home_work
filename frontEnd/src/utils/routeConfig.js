import React from 'react';

import {
    HomeOutlined,
    MessageOutlined,
    UserOutlined,
    DatabaseOutlined,
    SettingOutlined,
    DownloadOutlined,
} from '@ant-design/icons';

/** page */
import HomePage from '../page/Home/Home';
import ContentPage from '../page/Content/Content';
import UserPage from '../page/User/User';
import MemberListPage from '../page/MemberList/MemberList';
import PermissionSettingPage from '../page/PermissionSetting/PermissionSetting';
import CsvDownloadPage from '../page/CsvDownload/CsvDownload';

export const routeConfig = [
    {
        name: '首頁',
        path: '/',
        icon: <HomeOutlined />,
        disabled: false,
        route: <HomePage />,
        subMenu: [],
    },
    {
        name: '留言版',
        path: '/content',
        icon: <MessageOutlined />,
        disabled: false,
        route: <ContentPage />,
        subMenu: [
            {
                name: '留言版',
                path: '/content',
                icon: <MessageOutlined />,
            },
        ],
    },
    {
        name: '使用者資訊',
        path: '/user',
        icon: <UserOutlined />,
        disabled: false,
        route: <UserPage />,
        subMenu: [],
    },
    {
        name: '會員清單',
        path: '/member-list',
        icon: <DatabaseOutlined />,
        disabled: false,
        route: <MemberListPage />,
        subMenu: [],
    },
    {
        name: '權限設定',
        path: '/permission-setting',
        icon: <SettingOutlined />,
        disabled: false,
        route: <PermissionSettingPage />,
        subMenu: [],
    },
    {
        name: '表格輸出',
        path: '/table-export',
        icon: <DownloadOutlined />,
        disabled: false,
        route: <CsvDownloadPage />,
        subMenu: [],
    },
];
