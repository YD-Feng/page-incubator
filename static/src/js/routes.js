module.exports = [
    {
        path: '/',
        name: 'home',
        component: function (resolve) {
            require.ensure(['./../views/home.vue'], function (require) {
                resolve(require('./../views/home.vue'));
            }, 'home');
        },
        children: [
            {
                path: '/userList',
                name: 'userList',
                component: function (resolve) {
                    require.ensure(['./../views/userList/main.vue'], function (require) {
                        resolve(require('./../views/userList/main.vue'));
                    }, 'userList');
                }
            },
            {
                path: '/activityList',
                name: 'activityList',
                component: function (resolve) {
                    require.ensure(['./../views/activityList/main.vue'], function (require) {
                        resolve(require('./../views/activityList/main.vue'));
                    }, 'activityList');
                }
            },
            {
                path: 'activityPageList/:activityId?',
                name: 'activityPageList',
                component: function (resolve) {
                    require.ensure(['./../views/activityPageList/main.vue'], function (require) {
                        resolve(require('./../views/activityPageList/main.vue'));
                    }, 'activityPageList');
                }
            },
            {
                path: 'activityPageDetail/:pageId?',
                name: 'activityPageDetail',
                component: function (resolve) {
                    require.ensure(['./../views/activityPageDetail/main.vue'], function (require) {
                        resolve(require('./../views/activityPageDetail/main.vue'));
                    }, 'activityPageDetail');
                }
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: function (resolve) {
            require.ensure(['./../views/login.vue'], function (require) {
                resolve(require('./../views/login.vue'));
            }, 'login');
        }
    }
];
