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

const Routes = () => {
    const Auth = React.useContext(AuthContext)

    return (
        <Switch>
            <ProtectedLogin path="/" exact component={Home} />
            <ProtectedLogin path="/signup" component={Signup} />
            <ProtectedLogin path="/login" component={Login} auth={Auth.auth} />
            <ProtectedRoute path="/posts" auth={Auth.auth} component={Posts} />
            <ProtectedRoute path="/user/:id" auth={Auth.auth} component={User} />
            <Route path="/users/:id" auth={Auth.auth} component={OtherUser} />
            <Route path="/createpost" auth={Auth.auth} component={CreatePost} />
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

