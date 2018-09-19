const Observable = require('FuseJS/Observable');
const Api = require('Modules/Api');
const FlashMessage = require('Modules/FlashMessage');

const data = {
    name: Observable(''),
    email: Observable(''),
    password: Observable(''),
    password_confirmation: Observable(''),
    description: Observable(''),
}

const isLoading = Observable(false);
const errors = Observable();

const send_register_request = function(){
    if(isLoading.value){
        return;
    }

    isLoading.value = true;
    errors.clear();

    const reqBody = {};
    for(let key in data){
        reqBody[key] = data[key].value;
    }

    Api.init()
        .post('register')
        .body(reqBody)
        .json()
        .then( ({content, status}) => {
            isLoading.value = false;
            if(content.meta.code === 1){
                //show success flash message
                FlashMessage.singleton().success('Thanks for registration, please login in').show();
                router.goto('login');
                return;
            }

            //show error flash message
            errors.replaceAll(content.meta.message);
            FlashMessage.singleton().danger('Please fix registration errors').show();
        })
        .catch(e => {
            console.log(e.toString());
        });
}

module.exports = {
    data,
    isLoading,
    send_register_request,
    errors
}