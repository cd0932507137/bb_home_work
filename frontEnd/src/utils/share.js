/**
 * permissionValidation
 * @desc 權限驗證
 */
export const permissionValidation = props => {
    const { path, setPermissionValidationState } = props;
    const userData = localStorage.getItem('user');
    const userState = JSON.parse(userData);
    const filterPermission = userState.permission.filter(p => p.path === path);
    return setPermissionValidationState({
        default_permission: filterPermission[0].default_permission === 0 ? true : false,
        operational_permission: filterPermission[0].operational_permission === 0 ? true : false,
    });
};
