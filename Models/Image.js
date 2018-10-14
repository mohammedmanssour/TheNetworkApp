const Observable = require('FuseJS/Observable');
const Api = require('Modules/Api');
const Config = require('../Config');
const Auth = require('Modules/Auth');

function Image(id, path){
    this.id = Observable(id);

    this.path  = path;

    this.state = Observable(() => {
        if(!this.id){
            return 'not-uploaded';
        }

        return 'uploaded';
    });

    this.url = Observable(() => {
        if(!this.id.value){
            return '';
        }
        return this.generateUrl();
    })
}

Image.prototype.setId = function(id){
    this.id.value = id;
    return this;
}


Image.prototype.upload = function(){
    if(!this.path){
        return Promise.resolve('error');
    }

    this.state.value = 'uploading';

    return Api.init()
        .authorized()
        .upload('files/upload', this.path)
        .then(response => {
            if(response.meta.code === 1){
                this.state.value = 'uploaded';
                this.id.value = response.data.id;
                return Promise.resolve('uploaded');
            }

            this.state.value = 'not-uploaded';
            return Promise.resolve('not-uploaded');
        })
        .catch(e => {
            this.state.value = 'not-uploaded';
            return Promise.reject(e);
        })
}

Image.prototype.generateUrl = function(){
    return Config.baseUri + '/files/'+this.id.value+'?api_token='+Auth.singleton().token.value;
}

module.exports = Image