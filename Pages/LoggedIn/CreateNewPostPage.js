const Observable = require('FuseJS/Observable');
const Gallery = require('MissionFuse/Gallery');
const Image = require('Models/Image');
const Api = require('Modules/Api');
const FlashMessage = require('Modules/FlashMessage');

const data = {
    content: Observable(''),
    images: Observable()
}

const isLoading = Observable(false);
const errors = Observable();

function choose_upload_images(){
    Gallery.getImages()
        .then(paths => {
            console.log(JSON.stringify(paths));
            const images = paths.map(path => new Image(undefined,path));

            data.images.replaceAll(images);

            images.forEach(image => image.upload());
        })
        .catch(e => {
            console.log(e.toString());
        })
}


function delete_image(args){
    data.images.remove(args.data);
}

function get_request_body(){
    const reqBody = {
        content: data.content.value,
        images: []
    };

    data.images.forEach(image => reqBody.images.push(image.id.value));

    return reqBody;
}

function send_save_post_request(){
    if(isLoading.value){
        return;
    }

    isLoading.value = true;
    errors.clear();
    Api.init()
        .authorized()
        .post('posts')
        .body(get_request_body())
        .json()
        .then(({content}) => {
            if(content.meta.code === 1){
                FlashMessage.singleton().success('Post is saved').show();
                router.goBack();
                return;
            }

            errors.replaceAll(content.meta.message);
            FlashMessage.singleton().danger('Post isn\'t saved, please fix the errors').show();
        })
        .catch(e => {
            console.log(e.toString());
        })
}

module.exports = {
    data,
    choose_upload_images,
    delete_image,

    isLoading,
    errors,
    send_save_post_request

}