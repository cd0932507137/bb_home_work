describe('User page', () => {
    test('User page data', () => {
        const fns = {
            userState: () => {
                return {
                    username: 'demo',
                    email: 'demo@gamil.com',
                };
            },
        };
        expect(fns.userState()).toEqual({
            username: 'demo',
            email: 'demo@gamil.com',
        });
    });
});
