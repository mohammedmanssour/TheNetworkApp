const Observable = require('FuseJS/Observable');
const Api = require('Modules/Api');
const FlashMessage = require('Modules/FlashMessage');
const User = require('Modules/User');

const isLoading = Observable(false);

const errors = Observable();

const data = {
    email: Observable(''),
    password: Observable('')
}

const send_login_request = function(){

    if(isLoading.value){
        return;
    }

    isLoading.value = true;
    errors.clear();

    var reqBody = {};
    for(let key in data){
        reqBody[key] = data[key].value;
    }

    Api.init()
        .post('login')
        .body(reqBody)
        .json()
        .then(({content, status}) => {
            isLoading.value = false;
            if(content.meta.code === 1){
                User.singleton()
                    .update(content.data)
                    .saveToStorage();

                FlashMessage.singleton().success('You\'re now logged in').show();

                router.goto('loggedIn', {}, 'feed', {});

                return;
            }
            errors.replaceAll(content.meta.message);
            FlashMessage.singleton().danger('Please fix errors').show();
        })
        .catch(e => {
            console.log(e.toString());
        })
}

module.exports = {
    isLoading,
    send_login_request,
    data,
    errors
}