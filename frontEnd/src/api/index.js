import axios from 'axios';

// request header
axios.interceptors.request.use(
    config => config,
    err => {
        console.error('request err', err);
        return Promise.reject(err);
    },
);

// Error Handling
axios.interceptors.response.use(
    res => res,
    err => {
        const {
            response: { status },
            config: { url },
        } = err;
        if (status === 404) {
            throw new Error(`${url} not found`);
        }
        throw err;
    },
);

export const apiUserLogin = data => axios.post('/login', data);

export const apiUserRegister = data => axios.post('/register', data);

export const apiUserSendContent = data => axios.post('/sendContent', data);

export const apiUserMsg = () => axios.get('/msg');

export const apiUserMember = () => axios.get('/member');

export const apiUserEditMember = data => axios.put('/editMember', data);

export const apiUserDeleteMember = data => axios.delete('/deleteMember', data);

export const apiUserPermissionSetting = () => axios.get('/permission-setting');

export const apiUserPermissionList = data => axios.post('/permissionList', data);

export const apiUserRouterConfigList = () => axios.get('/routerConfigList');

export const apiUserEditPermission = data => axios.put('/editPermission', data);
