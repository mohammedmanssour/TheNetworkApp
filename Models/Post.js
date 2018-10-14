const Observable = require('FuseJS/Observable');
const Image = require('./Image');
const User = require('Modules/User');
const Api = require('Modules/Api');

function Post(router, post){
    this.id = post.id;
    this.content = post.content;
    this.created_at = post.created_at;
    this.images = post.images.map(id => new Image(id))
    this.user = (new User).update(post.user.data);
    this.likes = Observable(post.likes_count);
    this.comments = Observable(post.comments_count);

    this.liked_by_user = Observable(post.liked_by_user);


    //proxy properties
    this.toggleLike = Post.prototype.toggleLike.bind(this);
    this.gotoUserProfile = Post.prototype.gotoUserProfile.bind(this);

    //additional properties section
    this.router = router;
}

Post.prototype.like = function(){
    ++this.likes.value;
    this.liked_by_user.value = true;

    Api.init()
        .authorized()
        .post(`posts/${this.id}/likes`)
        .json()
        .then(({content}) => {
            if(content.meta.code === 0){
                --this.likes.value;
                this.liked_by_user.value = false;
                return;
            }
        })

    return this;
}

Post.prototype.unlike = function () {
    --this.likes.value;
    this.liked_by_user.value = false;

    Api.init()
        .authorized()
        .delete(`posts/${this.id}/likes`)
        .json()
        .then(({ content }) => {
            if (content.meta.code === 0) {
                ++this.likes.value;
                this.liked_by_user.value = true;
                return;
            }
        })

    return this;
}

Post.prototype.toggleLike = function(){
    if(this.liked_by_user.value){
        return this.unlike();
    }

    return this.like();
}

Post.prototype.gotoUserProfile = function(){
    this.router.push('loggedIn',{},'profile', {});
    return this;
}

module.exports = Post;