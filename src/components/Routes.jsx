//imports React
import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

//imports composants
import AuthContext from './AuthContext';
import Signup from './Auth/Signup';
import Login from './Auth/Login';

const Routes = () => {
    
    const Auth = React.useContext(AuthContext)

    return (
        <Switch>
            <ProtectedLogin path="/signup" component={Signup} />
            <ProtectedLogin path="/login" component={Login} auth={Auth.auth} />
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

export default Routes;

