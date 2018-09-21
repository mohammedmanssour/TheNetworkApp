const Api = require('Modules/Api');
const Observable = require('FuseJS/Observable');
const User = require('Modules/User');
const Auth = require('Modules/Auth');

const state = Observable('loading');
const message = Observable('Loading...');

Api.init()
    .get('test')
    .json()
    .then(({content, status}) => {
        if(content.meta.code === 1){
            return checkForUserInfo();
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

function checkForUserInfo(){
    let userInfo = undefined;
    return User.singleton()
            .readFromStorage()
            .then(content => {
                if(content === 'noinfo'){
                    return Promise.resolve('noinfo');
                }

                userInfo = content;
                return Auth.singleton()
                    .readFromStorage()
            })
            .then(content => {
                if(content === undefined || content === 'noinfo'){
                    return Promise.resolve('noinfo');
                }

                return Promise.resolve(userInfo);
            })
}

module.exports = {
    state,
    message,
    gotoRegister,
    gotoLogin
}