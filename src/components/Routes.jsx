//imports React
import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

//imports composants
import AuthContext from './AuthContext';
import Signup from './Auth/Signup';
import Login from './Auth/Login';
import Posts from './Posts/Posts';
import Home from './Home/Home';
import User from './Users/User';
import OtherUser from './Users/OtherUser';
import CreatePost from './Posts/CreatePost';
import UpdatePhoto from './Photo/UpdatePhoto';
import UpdateAccount from './Users/UpdateAccount';
import PostPage from './Posts/PostPage';
import DeleteAccount from './Users/DeleteAccount';
import AdminDeleteAccount from './Users/AdminDeleteAccount';
import DeletePost from './Posts/DeletePost';
import DeleteComment from './Comments/DeleteComment'; 
import UpdatePost from './Posts/UpdatePost';



const Routes = () => {
    const Auth = React.useContext(AuthContext)

    return (
        <Switch>
            <ProtectedLogin path="/" exact component={Home} />
            <ProtectedLogin path="/signup" component={Signup} />
            <ProtectedLogin path="/login" component={Login} auth={Auth.auth} />
            <ProtectedRoute path="/posts" auth={Auth.auth} component={Posts} />
            <ProtectedRoute path="/user/:id" auth={Auth.auth} component={User} />
            <ProtectedRoute path="/userdelete/:id" auth={Auth.auth} component={DeleteAccount} />
            <Route path="/users/:id" auth={Auth.auth} component={OtherUser} />
            <Route path="/createpost" auth={Auth.auth} component={CreatePost} />
            <Route path="/updatephoto/:id" auth={Auth.auth} component={UpdatePhoto} />
            <Route path="/updateaccount/:id" auth={Auth.auth} component={UpdateAccount} />
            <Route path="/post/:id" auth={Auth.auth} component={PostPage} />
            <Route path="/adminuserdelete/:id" auth={Auth.auth} component={AdminDeleteAccount} />
            <Route path="/deletepost/:id" auth={Auth.auth} component={DeletePost} />
            <Route path="/deletecomment/:id" auth={Auth.auth} component={DeleteComment} />
            <Route path="/updatepost/:id" auth={Auth.auth} component={UpdatePost} />
        </Switch>
    )
}

const ProtectedLogin = ({auth, component: Component, ...rest}) => {
    return(
        <Route 
        {...rest}
        render = {() => !auth? (
            <>
                <Component />
            </>
        ) :
            (
                <Redirect to="/posts" />
            )
            }
        />
    )
}

const ProtectedRoute = ({auth, component: Component, ...rest}) => {
    return(
        <Route 
        {...rest}
        render = {() => auth? (
            <>
                <Component />
            </>
        ) :
            (
                <Redirect to="/login" />
            )
            }
        />
    )
}

export default Routes;

