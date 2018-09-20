const Api = require('Modules/Api');
const Observable = require('FuseJS/Observable');
const User = require('Modules/User');

const state = Observable('loading');
const message = Observable('Loading...');

Api.init()
    .get('test')
    .json()
    .then(({content, status}) => {
        if(content.meta.code === 1){
            return User.singleton()
                .readFromStorage();
        }

        state.value = 'maintenance';
        message.value = 'Our server is in maintenance mode';
    })
    .then(response => {
        if(response === 'noinfo'){
            state.value = 'success';
            return;
        }

        state.value = 'profile';
        message.value = 'Loading Your profile....';

        setTimeout(() => {
            router.goto('loggedIn',{}, 'feed', {});
        }, 2000)
    })
    .catch(e => {
        state.value = 'not-connected';
        message.value = "Please Check your internet connection";
    });

function gotoRegister(){
    router.push('register');
}

function gotoLogin(){
    router.push('login');
}

module.exports = {
    state,
    message,
    gotoRegister,
    gotoLogin
}