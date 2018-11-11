module.exports = {
    state: {
        refreshListFlag: true
    },
    mutations: {
        triggerFlag: function (state) {
            state.refreshListFlag = !state.refreshListFlag;
        }
    }
};
