//imports React
import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

//imports composants
import AuthContext from './AuthContext';
import Signup from './Auth/Signup';
import Login from './Auth/Login';
import Posts from './Posts/Posts';
import Home from './Home/Home';

const Routes = () => {
    
    const Auth = React.useContext(AuthContext)

    return (
        <Switch>
            <ProtectedLogin path="/" exact component={Home} />
            <ProtectedLogin path="/signup" component={Signup} />
            <ProtectedLogin path="/login" component={Login} auth={Auth.auth} />
            <ProtectedRoute path="/posts" auth={Auth.auth} component={Posts} />
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

