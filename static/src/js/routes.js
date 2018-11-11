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
                path: 'activityList',
                name: 'activityList',
                component: function (resolve) {
                    require.ensure(['./../views/activityList/main.vue'], function (require) {
                        resolve(require('./../views/activityList/main.vue'));
                    }, 'activityList');
                }
            }/*,
            {
                path: 'activityDetail/:activityId?',
                name: 'activityDetail',
                component: function (resolve) {
                    require.ensure(['./../views/activityDetail/main.vue'], function (require) {
                        resolve(require('./../views/activityDetail/main.vue'));
                    }, 'activityDetail');
                }
            }*/
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
