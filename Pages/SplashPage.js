const Api = require('Modules/Api');
const Observable = require('FuseJS/Observable');

const state = Observable('loading');
const message = Observable('Loading...');

Api.init()
    .get('test')
    .json()
    .then(({content, status}) => {
        if(content.meta.code === 1){
            state.value = 'success';
            return;
        }

        state.value = 'maintenance';
        message.value = 'Our server is in maintenance mode';
    })
    .catch(e => {
        state.value = 'not-connected';
        message.value = "Please Check your internet connection";
    });

module.exports = {
    state,
    message
}