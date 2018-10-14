const State = require('Modules/State');
const User = require('Modules/User');

let state = State.singleton();

function toggle_menu(){
    state.setState({menuOpened: !state.menuOpened.value})
}

function navigate(args){
    state.setState({ menuOpened: false });

    switch (args.sender){
        case 'latestPostsMenuItem':
            router.push('loggedIn',{},'feed',{'source': 'latest'});
            break;

        case 'trendyPostsMenuItem':
            router.push('loggedIn', {}, 'feed', { 'source': 'trendy' });
            break;

        case 'FeedMenuItem':
            router.push('loggedIn', {}, 'feed', { 'source': 'feed' });
            break;

        case 'createPostMenuItem':
            router.push('loggedIn',{},'newPost',{});
            break;

        case 'logoutMenuItem':
            User.singleton()
                .setLoggedOut()
                .update({})
                .saveToStorage();
            router.goto('splash');
            break;

        default:

        break;
    }
}


module.exports = {
    state,
    user: User.singleton(),
    toggle_menu,
    navigate
}