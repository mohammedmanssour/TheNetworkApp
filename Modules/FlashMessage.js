
const Observable = require('FuseJS/Observable');

let instance = undefined;

function FlashMessage(type, message) {
    this.type = Observable(type);
    this.message = Observable(message);

    this.state = Observable('hidden');
    this.timer = '';
}

FlashMessage.singleton = function () {
    if (!instance) {
        instance = new FlashMessage();
    }

    return instance;
}

FlashMessage.prototype.setType = function (type) {
    this.type.value = type;
    return this;
}

FlashMessage.prototype.setMessage = function (message) {
    this.message.value = message;
    return this;
}

FlashMessage.prototype.success = function (message) {
    this.type.value = 'success';
    this.message.value = message;
    return this;
}

FlashMessage.prototype.danger = function (message) {
    this.type.value = 'danger';
    this.message.value = message;
    return this;
}

FlashMessage.prototype.show = function () {
    this.state.value = 'shown';
    this.timer = setTimeout(() => {
        this.state.value = 'hidden';
        clearTimeout(this.timer);
    }, 3000);

    return this;
}

FlashMessage.prototype.hide = function () {
    this.state.value = 'hidden';
    return this;
}

module.exports = FlashMessage;