const Observable = require('FuseJS/Observable');
const Post = require('Models/Post');
const Api = require('Modules/Api');
const Logger = require('Modules/Logger');

function Posts(router, source = 'latest'){

    this.source = source;

    this.list = Observable();

    this.state = Observable('ready');
    this.isReloading = Observable(() => {
        if(this.state.value === 'loading'){
            return true;
        }

        return false;
    })

    this.current_page = Observable(1);
    this.total = Observable();

    //additional properties section
    this.router = router;

    //proxy properties
    this.get_more = Posts.prototype.get_more.bind(this);
    this.fetch = Posts.prototype.fetch.bind(this);
}

Posts.prototype.fill = function(posts){
    this.list.replaceAll(posts);
    return this;
}

Posts.prototype.addArray = function (posts) {
    this.list.addAll(posts);
    return this;
}

Posts.prototype.fetch = function(){
    if(this.state.value === 'loading'){
        return;
    }

    this.state.value = 'loading';
    this.current_page.value = 1;
    this.send_api_request(1)
        .then(({content}) => {
            if(content.meta.code  === 1){
                this.state.value = 'ready';
                this.fill(content.data.map(post => new Post(this.router,post)));
                return;
            }

            this.state.value = 'empty';
            this.fill([]);
        })
        .catch(e => {
            console.log(e.toString());
            this.state.value = 'error';
        })
}

Posts.prototype.get_more = function(){
    if(this.state.value === 'ready-loading' || this.state.value === 'ready-no-more'){
        return;
    }

    this.state.value = 'ready-loading';

    this.send_api_request(++this.current_page.value)
        .then(({content}) => {
            if(content.meta.code === 1){
                this.state.value = 'ready';
                this.addArray(content.data.map(post => new Post(this.router, post) ));
                return;
            }

            this.state.value = 'ready-no-more';
            return;
        })
        .catch(e => {
            console.log(e.toString());
            this.state.value = 'ready-error';
        })
}

Posts.prototype.send_api_request = function(page){
    return Api.init()
        .authorized()
        .get('posts', {source: this.source, page})
        .json();
}

module.exports = Posts;