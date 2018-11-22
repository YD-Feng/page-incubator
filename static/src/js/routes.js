module.exports = [
    {
        path: '/',
        name: 'main',
        component: function (resolve) {
            require.ensure(['./../views/main.vue'], function (require) {
                resolve(require('./../views/main.vue'));
            }, 'main');
        },
        children: [
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
