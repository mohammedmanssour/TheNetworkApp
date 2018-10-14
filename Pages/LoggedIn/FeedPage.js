const Observable = require('FuseJS/Observable');
const Posts = require('Modules/Posts');

const posts = Observable();
const title = Observable();


this.Parameter.onValueChanged(module,function(x){
    const source = x.source;

    switch (source) {
        case 'trendy':
            title.value = 'Trendy Posts';
            break;

        case 'feed':
            title.value = 'Timeline';
            break;

        default:
            title.value = 'latest posts';
            break;
    }

    posts.value = new Posts(router, source);
    posts.value.fetch();
});


module.exports = {
    posts,
    title
}